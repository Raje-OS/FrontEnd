import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthorCardComponent} from '../../../../persons/authors/components/author-card/author-card.component';
import {Book} from '../../model/book.entity';
import {AuthorService} from '../../../../persons/authors/services/author.service.service';
import {ReviewService} from '../../../../reviews/services/review.service';
import {BookService} from '../../services/book.service.service';
import {Router} from '@angular/router';
import {LibraryCardComponent} from '../../../libraries/components/library-card/library-card.component';
import {LibraryService} from '../../../libraries/services/library.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, AuthorCardComponent, LibraryCardComponent],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  @Input() book: Book | null = null;
  author: any = null;
  libraries: any[] = [];

  constructor(
    private authorService: AuthorService,
    private bookService: BookService,
    private reviewService: ReviewService,
    private router: Router,
    private libraryService: LibraryService
  ) {}

  roundedRating = 0;

  ngOnInit(): void {
    if (this.book) {
      this.loadAuthor(this.book.autorId);
      this.actualizarCalificacionPromedio();
      this.redondearCalificacion();
      // ✅ corregido: this.book en vez de book
      if (this.book.librerias_id?.length > 0) {
        this.libraryService.getAll().subscribe(allLibs => {
          this.libraries = allLibs.filter(lib => this.book!.librerias_id.includes(lib.id));
        });
      }
    }
  }

  actualizarCalificacionPromedio() {
    if (!this.book?.id) return;

    this.reviewService.getReviewsByContenidoId(this.book.id).subscribe(reviews => {
      if (!reviews || reviews.length === 0) return;

      const suma = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
      const promedio = Math.round((suma / reviews.length) * 10) / 10;

      if (this.book) {
        this.book.calificacion = promedio;
        this.bookService.updateBook(this.book).subscribe({
          next: () => console.log('Calificación actualizada'),
          error: err => console.error('Error al actualizar calificación', err)
        });
      }
    });
  }

  loadAuthor(authorId: string): void {
    this.authorService.getAuthorById(authorId).subscribe(author => {
      this.author = author;
    });
  }
  goToLibraryDetail(id: string): void {
    this.router.navigate(['/libraries', id]);
  }

  redondearCalificacion(): void {
    if (this.book?.calificacion != null) {
      this.roundedRating = Math.round(this.book.calificacion);
    }
  }

}
