import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../users/pages/login-form/services/auth.service';
import { UserDetailService } from '../../../../users/services/user-detail/user-detail.service';
import { MovieService } from '../../../../contents/movies/services/movie.service.service';
import { SerieService } from '../../../../contents/series/services/serie.service.service';
import { BookService } from '../../../../contents/books/services/book.service.service';
import {MovieCardComponent} from '../../../../contents/movies/components/movie-card/movie-card.component';
import {SerieCardComponent} from '../../../../contents/series/components/serie-card/serie-card.component';
import {BookCardComponent} from '../../../../contents/books/components/book-card/book-card.component';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
  imports: [CommonModule, MovieCardComponent, SerieCardComponent, BookCardComponent]
})
export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];

  constructor(
    private authService: AuthService,
    private userDetailService: UserDetailService,
    private movieService: MovieService,
    private serieService: SerieService,
    private bookService: BookService
  ) {}

  eliminarFavorito(id: string) {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.userDetailService.getAll().subscribe(details => {
      const userDetail = details.find((d: any) => d.userId === user.id);
      if (!userDetail) return;


      userDetail.favorites = userDetail.favorites.filter((favId: string) => favId !== id);


      this.userDetailService.updateUserDetails(userDetail).subscribe(() => {

        this.favoritos = this.favoritos.filter(fav => fav.id !== id);
      });
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.userDetailService.getAll().subscribe(details => {
      const userDetail = details.find((d: any) => d.userId === user.id);
      if (!userDetail || !userDetail.favorites) return;

      const favIds: string[] = userDetail.favorites;
      const favs: any[] = [];

      favIds.forEach(id => {
        if (id.startsWith('MV')) {
          this.movieService.getMovieById(id).subscribe(movie => {
            favs.push({ ...movie, tipo: 'Película' });
          });
        } else if (id.startsWith('SR')) {
          this.serieService.getSerieById(id).subscribe(serie => {
            favs.push({ ...serie, tipo: 'Serie' });
          });
        } else if (id.startsWith('BK')) {
          this.bookService.getBookById(id).subscribe(book => {
            favs.push({ ...book, tipo: 'Libro' });
          });
        }
      });


      setTimeout(() => {
        this.favoritos = favs;
      }, 500);
    });
  }
}
