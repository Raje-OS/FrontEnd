import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../users/pages/login-form/services/auth.service';
import { Router } from '@angular/router';
import { BookService } from '../../../books/services/book.service.service';
import { Library } from '../../model/library.entity';
import { Book } from '../../../books/model/book.entity';
import { MatCard, MatCardActions, MatCardContent, MatCardImage } from '@angular/material/card';
import { LibraryToolbarComponent } from '../library-toolbar/library-toolbar.component';
import { MatButton } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';
import { LibraryService } from '../../services/library.service';

@Component({
  selector: 'app-library-dashboard',
  templateUrl: './library-dashboard.component.html',
  styleUrls: ['./library-dashboard.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardActions,
    LibraryToolbarComponent,
    MatCardImage,
    MatButton,
    NgIf,
    NgForOf
  ]
})
export class LibraryDashboardComponent implements OnInit {
  currentLibrary: Library | null = null;
  allBooks: Book[] = [];
  catalogBooks: Book[] = [];
  availableBooks: Book[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private bookService: BookService,
    private libraryService: LibraryService
  ) {}

  ngOnInit(): void {
    this.currentLibrary = this.authService.getCurrentLibrary();
    if (!this.currentLibrary) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(allBooks => {
      this.allBooks = allBooks;

      const currentLibraryId = this.currentLibrary?.id;
      if (!currentLibraryId) return;

      this.catalogBooks = allBooks.filter(book =>
        book.librerias_id?.includes(currentLibraryId)
      );

      this.availableBooks = allBooks.filter(book =>
        !book.librerias_id?.includes(currentLibraryId)
      );
    });
  }

  isInCatalog(book: Book): boolean {
    return book.librerias_id?.includes(this.currentLibrary?.id || '') || false;
  }

  addBookToCatalog(book: Book): void {
    if (!this.currentLibrary) return;

    if (!book.librerias_id) {
      book.librerias_id = [];
    }

    if (!book.librerias_id.includes(this.currentLibrary.id)) {
      book.librerias_id.push(this.currentLibrary.id);
      this.bookService.updateBook(book).subscribe(() => {
        this.loadBooks();
      });
    }
  }

  removeBookFromCatalog(book: Book): void {
    if (!this.currentLibrary || !book.librerias_id) return;

    book.librerias_id = book.librerias_id.filter(id => id !== this.currentLibrary?.id);
    this.bookService.updateBook(book).subscribe(() => {
      this.loadBooks();
    });
  }
}
