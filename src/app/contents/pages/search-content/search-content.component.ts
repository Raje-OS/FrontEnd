import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MovieCardComponent } from '../../movies/components/movie-card/movie-card.component';
import { SerieCardComponent } from '../../series/components/serie-card/serie-card.component';
import { BookCardComponent } from '../../books/components/book-card/book-card.component';
import { Movie } from '../../movies/model/movie.entity';
import { Serie } from '../../series/model/serie.entity';
import { Book } from '../../books/model/book.entity';
import { MovieService } from '../../movies/services/movie.service.service';
import { SerieService } from '../../series/services/serie.service.service';
import { BookService } from '../../books/services/book.service.service';

type TypedMovie = Movie & { type: 'movie' };
type TypedSerie = Serie & { type: 'serie' };
type TypedBook = Book & { type: 'book' };
type TypedContent = TypedMovie | TypedSerie | TypedBook;

@Component({
  selector: 'app-search-content',
  standalone: true,
  templateUrl: './search-content.component.html',
  styleUrl: './search-content.component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    RouterLink,
    MovieCardComponent,
    SerieCardComponent,
    BookCardComponent
  ]
})
export class SearchContentComponent implements OnInit {
  stars = Array(5).fill(0);
  selectedRating = 0;
  modalAbierto = false;

  searchQuery = '';
  selectedGenre = '';
  selectedType = '';

  allItems: TypedContent[] = [];
  items: TypedContent[] = [];

  constructor(
    private movieService: MovieService,
    private serieService: SerieService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.loadAllContent();
  }

  loadAllContent(): void {
    const movie$ = this.movieService.getMovies();
    const serie$ = this.serieService.getSeries();
    const book$ = this.bookService.getBooks();

    // Ejecutamos todas las peticiones en paralelo
    movie$.subscribe(movies => {
      const typedMovies: TypedMovie[] = movies.map(m => ({ ...m, type: 'movie' }));
      this.allItems.push(...typedMovies);
      this.buscar();
    });

    serie$.subscribe(series => {
      const typedSeries: TypedSerie[] = series.map(s => ({ ...s, type: 'serie' }));
      this.allItems.push(...typedSeries);
      this.buscar();
    });

    book$.subscribe(books => {
      const typedBooks: TypedBook[] = books.map(b => ({ ...b, type: 'book' }));
      this.allItems.push(...typedBooks);
      this.buscar();
    });
  }

  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  selectStar(rating: number): void {
    this.selectedRating = rating;
    this.buscar();
  }

  buscar(): void {
    this.items = this.allItems.filter(item => {
      const nombreCoincide = item.titulo.toLowerCase().includes(this.searchQuery.toLowerCase());
      const generoCoincide = !this.selectedGenre || item.genero.includes(this.selectedGenre);
      const tipoCoincide = !this.selectedType || item.type === this.selectedType;
      const estrellasCoincide = !this.selectedRating || Math.floor(item.calificacion) === this.selectedRating;
      return nombreCoincide && generoCoincide && tipoCoincide && estrellasCoincide;
    });
  }
}
