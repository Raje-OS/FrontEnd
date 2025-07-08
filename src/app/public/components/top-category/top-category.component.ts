import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../contents/movies/services/movie.service.service';
import { SerieService } from '../../../contents/series/services/serie.service.service';
import { BookService } from '../../../contents/books/services/book.service.service';
import { MovieCardComponent } from '../../../contents/movies/components/movie-card/movie-card.component';
import { SerieCardComponent } from '../../../contents/series/components/serie-card/serie-card.component';
import { BookCardComponent } from '../../../contents/books/components/book-card/book-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-category',
  standalone: true,
  imports: [
    CommonModule,
    MovieCardComponent,
    SerieCardComponent,
    BookCardComponent,
    FormsModule
  ],
  templateUrl: './top-category.component.html',
  styleUrls: ['./top-category.component.css']
})
export class TopCategoryComponent implements OnInit {
  type: string = '';
  allItems: any[] = [];
  items: any[] = [];

  modalAbierto = false;
  stars = Array(5).fill(0);
  selectedRating = 0;
  selectedGenre = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private serieService: SerieService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type') ?? '';
    this.cargarDatos();
  }

  cargarDatos(): void {
    switch (this.type) {
      case 'movie':
        this.movieService.getMovies().subscribe(data => {
          this.allItems = data.map(d => ({ ...d, type: 'movie' }));
          this.items = [...this.allItems];
        });
        break;
      case 'serie':
        this.serieService.getSeries().subscribe(data => {
          this.allItems = data.map(d => ({ ...d, type: 'serie' }));
          this.items = [...this.allItems];
        });
        break;
      case 'book':
        this.bookService.getBooks().subscribe(data => {
          this.allItems = data.map(d => ({ ...d, type: 'book' }));
          this.items = [...this.allItems];
        });
        break;
    }
  }

  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  selectStar(rating: number): void {
    this.selectedRating = rating;
  }

  aplicarFiltro(): void {
    this.items = this.allItems.filter(item => {
      const generoOk = !this.selectedGenre || item.genero.includes(this.selectedGenre);
      const estrellasOk = !this.selectedRating || Math.floor(item.calificacion) === this.selectedRating;
      return generoOk && estrellasOk;
    });
    this.cerrarModal();
  }

  goBack(): void {
    this.router.navigate(['/tendencies']);
  }
}
