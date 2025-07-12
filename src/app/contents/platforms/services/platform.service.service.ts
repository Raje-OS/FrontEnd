import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Platform } from '../model/platform.entity';
import {catchError, map, switchMap} from 'rxjs/operators';
import {MovieService} from '../../movies/services/movie.service.service';
import {SerieService} from '../../series/services/serie.service.service';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private baseUrl = environment.serverBaseUrl + environment.platformEndpointPath;

  constructor(private http: HttpClient,
  private movieService: MovieService,
              private seriesService: SerieService
  ) {}

  getAllPlatforms(): Observable<Platform[]> {
    return this.http.get<Platform[]>(this.baseUrl);
  }

  // Obtener plataformas por múltiples IDs
  getPlatformsByIds(ids: string[]): Observable<Platform[]> {
    // Crea un array de observables llamando al método `getPlatformById` para cada ID
    const platformObservables = ids.map(id => this.getPlatformById(id));

    // Combinamos todas las respuestas usando `forkJoin` para esperar que todas las solicitudes se completen
    return forkJoin(platformObservables).pipe(
      // Filtra cualquier valor null de la respuesta
      map((platforms) => platforms.filter(platform => platform !== null) as Platform[]),  // Filtramos null y forzamos el tipo a Platform[]
      catchError(error => {
        console.error('Error fetching platforms:', error);
        return of([]);  // Devuelve un array vacío en caso de error
      })
    );
  }

// Obtener una plataforma por ID (utilizando una ruta con un parámetro dinámico)
  getPlatformById(id: string): Observable<Platform | null> {
    const url = `${environment.serverBaseUrl}/platforms/${id}`; // Suponiendo que la URL para obtener plataformas sea '/platforms/{id}'
    return this.http.get<Platform>(url).pipe(
      catchError(error => {
        console.error('Error fetching platform:', error);
        return of(null);  // Devuelve null en caso de error
      })
    );
  }


  updatePlatform(platform: Platform): Observable<Platform> {
    return this.http.put<Platform>(`${this.baseUrl}/${platform.id}`, platform);
  }



}
