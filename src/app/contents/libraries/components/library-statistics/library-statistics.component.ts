import { Component, OnInit } from '@angular/core';
import { Library } from '../../model/library.entity';
import { AuthService } from '../../../../users/pages/login-form/services/auth.service';
import { BookService } from '../../../books/services/book.service.service';
import { Book } from '../../../books/model/book.entity';
import { Router } from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {LibraryToolbarComponent} from '../library-toolbar/library-toolbar.component';
import {MatCard, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-library-statistics',
  templateUrl: './library-statistics.component.html',
  styleUrls: ['./library-statistics.component.css'],
  imports: [
    NgForOf,
    NgIf,
    LibraryToolbarComponent,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatCardImage
  ],
  standalone: true
})
export class LibraryStatisticsComponent implements OnInit {
  currentLibrary: Library | null = null;
  catalogBooks: Book[] = [];
  loading = false;

  statistics = {
    totalBooks: 0,
    genreDistribution: {} as Record<string, number>,
    topBook: null as Book | null,
    worstBook: null as Book | null
  };

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentLibrary = this.authService.getCurrentLibrary();
    if (!this.currentLibrary) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCatalogBooks();
  }

  loadCatalogBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe(allBooks => {
      this.catalogBooks = allBooks.filter(book =>
        this.currentLibrary!.catalog.includes(book.id)
      );

      this.calculateStatistics();
      this.loading = false;
    });
  }

  calculateStatistics(): void {
    this.statistics.totalBooks = this.catalogBooks.length;

    const genreCount: { [key: string]: number } = {};
    let topBook: Book | null = null;
    let worstBook: Book | null = null;

    this.catalogBooks.forEach(book => {
      // Acumular géneros
      book.genero?.forEach(g => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });

      // Calcular libro con mejor y peor calificación
      if (typeof book.calificacion === 'number') {
        if (!topBook || book.calificacion > (topBook.calificacion || 0)) {
          topBook = book;
        }
        if (!worstBook || book.calificacion < (worstBook.calificacion || 5)) {
          worstBook = book;
        }
      }
    });

    this.statistics.genreDistribution = genreCount;
    this.statistics.topBook = topBook;
    this.statistics.worstBook = worstBook;
  }
  getGenreKeys(): string[] {
    return Object.keys(this.statistics.genreDistribution);
  }


}
