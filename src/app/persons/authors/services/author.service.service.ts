import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { map } from 'rxjs/operators';
import {Author} from '../model/author.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private baseUrl = environment.serverBaseUrl + environment.authorEndpointPath;

  constructor(private http: HttpClient) {}

  getAuthorById(id: string): Observable<Author> {
    return this.http.get<any[]>(`${this.baseUrl}/{id}`).pipe(
      map(authors => new Author(authors[0] || {}))
    );
  }
}
