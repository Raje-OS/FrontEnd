import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { map } from 'rxjs/operators';
import {Book} from '../model/book.entity';
import {ReviewService} from '../../../reviews/services/review.service';
import {Serie} from '../../series/model/serie.entity';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = environment.serverBaseUrl + environment.bookEndpointPath;

  constructor(private http: HttpClient, private reviewService: ReviewService) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(books => books.map(book => new Book(book)))
    );
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${environment.serverBaseUrl}/books/${id}`);
  }

  updateBook(book: Book): Observable<Book> {
    // Se asume que el backend espera la URL con el id del libro
    return this.http.put<Book>(`${this.baseUrl}/${book.id}`, book);
  }

  getBooksOrderedByRating(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl).pipe(
      map(books => books.sort((a, b) => b.calificacion - a.calificacion))
    );
  }



}
