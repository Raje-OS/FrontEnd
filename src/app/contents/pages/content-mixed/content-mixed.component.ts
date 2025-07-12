import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieService } from '../../movies/services/movie.service.service';
import { BookService } from '../../books/services/book.service.service';
import { SerieService } from '../../series/services/serie.service.service';
import { CreateReviewComponent } from '../../../reviews/components/create-review/create-review.component';
import { OtherUserReviewCardComponent } from '../../../reviews/components/other-user-review-card/other-user-review-card.component';
import { SerieDetailComponent } from '../../series/components/serie-detail/serie-detail.component';
import { BookDetailComponent } from '../../books/components/book-detail/book-detail.component';
import { MovieDetailComponent } from '../../movies/components/movie-detail/movie-detail.component';
import { Serie } from '../../series/model/serie.entity';
import { Book } from '../../books/model/book.entity';
import { Movie } from '../../movies/model/movie.entity';
import { Review } from '../../../reviews/model/review.entity';
import { ReviewService } from '../../../reviews/services/review.service';
import { AddToListComponent } from '../../../lists/components/add-to-list/add-to-list.component';
import {AuthService} from '../../../users/pages/login-form/services/auth.service';
import {UserDetailService} from '../../../users/services/user-detail/user-detail.service';

@Component({
  selector: 'app-content-mixed',
  standalone: true,
  imports: [
    CommonModule,
    MovieDetailComponent,
    BookDetailComponent,
    SerieDetailComponent,
    OtherUserReviewCardComponent,
    CreateReviewComponent,
    AddToListComponent
  ],
  templateUrl: './content-mixed.component.html',
  styleUrls: ['./content-mixed.component.css']
})
export class ContentMixedComponent implements OnInit {
  mixedContent: (Movie | Book | Serie)[] = [];
  reviewsByContent: { [key: string]: Review[] } = {};

  favoriteIds: string[] = [];
  viewedIds: string[] = [];

  constructor(
    private authService: AuthService,
    private userDetailService: UserDetailService,
    private movieService: MovieService,
    private bookService: BookService,
    private serieService: SerieService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.userDetailService.getByUserId(user.id).subscribe({
      next: userDetail => {
        this.favoriteIds = userDetail.favorites || [];
        this.viewedIds = userDetail.viewed || [];
        this.loadContent();
      },
      error: error => {
        console.error('No se pudo cargar el UserDetail:', error);
        // Puedes decidir cargar contenido igual si es necesario:
        // this.loadContent();
      }
    });
  }


  loadContent(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.bookService.getBooks().subscribe(books => {
        this.serieService.getSeries().subscribe(series => {
          this.mixedContent = this.mixContentSmart(movies, books, series);
          this.loadReviews();
        });
      });
    });
  }

  loadReviews(): void {
    this.mixedContent.forEach(item => {
      this.reviewService.getReviewsByMovieId(item.id).subscribe(reviews => {
        this.reviewsByContent[item.id] = reviews
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 2);
      });
    });
  }

  getReviewsForContent(contentId: string): Review[] {
    return this.reviewsByContent[contentId] || [];
  }

  isMovie(item: any): item is Movie {
    return item instanceof Movie;
  }

  isBook(item: any): item is Book {
    return item instanceof Book;
  }

  isSerie(item: any): item is Serie {
    return item instanceof Serie;
  }

  shuffle<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  getGenresAndActorsFromFavorites(
    movies: Movie[],
    series: Serie[]
  ): { genres: Set<string>, actors: Set<string> } {
    const genres = new Set<string>();
    const actors = new Set<string>();

    const all = [...movies, ...series];

    all
      .filter(item => this.favoriteIds.includes(item.id) || this.viewedIds.includes(item.id))
      .forEach(item => {
        item.genero?.forEach(g => genres.add(g));
        item.actoresId?.forEach(a => actors.add(a));
      });

    return { genres, actors };
  }


  mixContentSmart(movies: Movie[], books: Book[], series: Serie[]): (Movie | Book | Serie)[] {
    const { genres, actors } = this.getGenresAndActorsFromFavorites(movies,series);

    // --- PELÍCULAS ---
    const unseenMovies = movies.filter(m => !this.favoriteIds.includes(m.id) && !this.viewedIds.includes(m.id));
    const recoMoviesByActors = unseenMovies.filter(m => m.actoresId?.some(a => actors.has(a))).map(m => new Movie(m));
    const recoMoviesByGenres = unseenMovies
      .filter(m => !recoMoviesByActors.includes(m) && m.genero?.some(g => genres.has(g)))
      .map(m => new Movie(m));
    const recoMoviesOthers = unseenMovies
      .filter(m => !recoMoviesByActors.includes(m) && !recoMoviesByGenres.includes(m))
      .map(m => new Movie(m));

    // --- SERIES ---
    const unseenSeries = series.filter(s => !this.favoriteIds.includes(s.id) && !this.viewedIds.includes(s.id));
    const recoSeriesByActors = unseenSeries.filter(s => s.actoresId?.some(a => actors.has(a))).map(s => new Serie(s));
    const recoSeriesByGenres = unseenSeries
      .filter(s => !recoSeriesByActors.includes(s) && s.genero?.some(g => genres.has(g)))
      .map(s => new Serie(s));
    const recoSeriesOthers = unseenSeries
      .filter(s => !recoSeriesByActors.includes(s) && !recoSeriesByGenres.includes(s))
      .map(s => new Serie(s));

    // --- LIBROS ---
    const unseenBooks = books.filter(b => !this.favoriteIds.includes(b.id) && !this.viewedIds.includes(b.id));
    const recoBooksByGenres = unseenBooks
      .filter(b => b.genero?.some(g => genres.has(g)))
      .map(b => new Book(b));
    const recoBooksOthers = unseenBooks
      .filter(b => !recoBooksByGenres.includes(b))
      .map(b => new Book(b));

    // --- CONTENIDO YA VISTO O FAVORITO ---
    const seenOrFavMovies = movies.filter(m => this.favoriteIds.includes(m.id) || this.viewedIds.includes(m.id)).map(m => new Movie(m));
    const seenOrFavSeries = series.filter(s => this.favoriteIds.includes(s.id) || this.viewedIds.includes(s.id)).map(s => new Serie(s));
    const seenOrFavBooks = books.filter(b => this.favoriteIds.includes(b.id) || this.viewedIds.includes(b.id)).map(b => new Book(b));

    // --- MEZCLAS ---
    const recoByActors = this.shuffle([...recoMoviesByActors, ...recoSeriesByActors]);
    const recoByGenres = this.shuffle([...recoMoviesByGenres, ...recoSeriesByGenres, ...recoBooksByGenres]);
    const recoOthers = this.shuffle([...recoMoviesOthers, ...recoSeriesOthers, ...recoBooksOthers]);
    const seenOrFav = this.shuffle([...seenOrFavMovies, ...seenOrFavSeries, ...seenOrFavBooks]);

    return [...recoByActors, ...recoByGenres, ...recoOthers, ...seenOrFav];
  }


}
