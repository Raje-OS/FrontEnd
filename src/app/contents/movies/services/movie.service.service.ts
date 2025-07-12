import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {Movie} from '../model/movie.entity';
import {ReviewService} from '../../../reviews/services/review.service';
import {Book} from '../../books/model/book.entity';
import {Serie} from '../../series/model/serie.entity';


@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = environment.serverBaseUrl + environment.movieEndpointPath;

  constructor(private http: HttpClient, private reviewService: ReviewService) {}

  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getMovieById(id: string): Observable<any> {
    return this.http.get<Movie>(`${environment.serverBaseUrl}/movies/${id}`)
  }

  updateMovie(movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.baseUrl}/${movie.id}`, movie);
  }
  getMoviesOrderedByRating(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseUrl).pipe(
      map(movies => movies.sort((a, b) => b.calificacion - a.calificacion))
    );
  }


}
