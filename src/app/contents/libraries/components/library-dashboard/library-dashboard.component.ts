import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../users/pages/login-form/services/auth.service';
import { Router } from '@angular/router';
import { BookService } from '../../../books/services/book.service.service';
import { Library } from '../../model/library.entity';
import { Book } from '../../../books/model/book.entity';
import {MatCard, MatCardActions, MatCardContent, MatCardImage} from '@angular/material/card';
import {LibraryToolbarComponent} from '../library-toolbar/library-toolbar.component';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {LibraryService} from '../../services/library.service';

@Component({
  selector: 'app-library-dashboard',
  templateUrl: './library-dashboard.component.html',
  styleUrls: ['./library-dashboard.component.css'],
  imports: [
    MatCard,
    MatCardContent,
    MatCardActions,
    LibraryToolbarComponent,
    MatCardImage,
    MatButton,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class LibraryDashboardComponent implements OnInit {
  currentLibrary: Library | null = null;
  allBooks: Book[] = [];
  catalogBooks: Book[] = [];
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
    this.loading = true;
    this.bookService.getBooks().subscribe(books => {
      this.allBooks = books;
      this.catalogBooks = books.filter(book => this.currentLibrary?.catalog.includes(book.id));
      this.loading = false;
    });
  }

  isInCatalog(bookId: string): boolean {
    return this.currentLibrary?.catalog.includes(bookId) || false;
  }

  addBookToCatalog(bookId: string): void {
    if (!this.currentLibrary) return;

    this.libraryService.addBookToCatalog(this.currentLibrary.id, bookId).subscribe(updated => {
      this.currentLibrary = updated;
      localStorage.setItem('currentLibrary', JSON.stringify(updated));
      this.loadBooks();
    });
  }


  removeBookFromCatalog(bookId: string): void {
    if (!this.currentLibrary) return;

    this.libraryService.removeBookFromCatalog(this.currentLibrary.id, bookId).subscribe(updated => {
      this.currentLibrary = updated;
      localStorage.setItem('currentLibrary', JSON.stringify(updated));
      this.loadBooks();
    });
  }

}
