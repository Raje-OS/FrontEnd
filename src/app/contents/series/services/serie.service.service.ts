import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {Serie} from '../model/serie.entity';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SerieService {
  private baseUrl = environment.serverBaseUrl + environment.serieEndpointPath;

  constructor(private http: HttpClient) {}

  // Obtener todas las series
  getSeries(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getAllSeries(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Obtener una serie por su ID
  getSerieById(id: string): Observable<Serie> {
    return this.http.get<any[]>(`${this.baseUrl}?id=${id}`).pipe(
      map(series => series[0] || {})
    );
  }

  updateSerie(serie: Serie): Observable<Serie> {
    // Se asume que el backend espera la URL con el id de la serie
    return this.http.put<Serie>(`${this.baseUrl}/${serie.id}`, serie);
  }

  getSeriesOrderedByRating(): Observable<Serie[]> {
    return this.http.get<Serie[]>(this.baseUrl).pipe(
      map(series => series.sort((a, b) => b.calificacion - a.calificacion))
    );
  }
}
