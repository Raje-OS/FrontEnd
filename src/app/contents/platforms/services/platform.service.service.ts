import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Platform } from '../model/platform.entity';
import {map, switchMap} from 'rxjs/operators';
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

  getPlatformById(id: string): Observable<Platform> {
    return this.http.get<Platform>(`${this.baseUrl}/${id}`);
  }

  getPlatformsByIds(ids: string[]): Observable<Platform[]> {
    const query = ids.map(id => `id=${id}`).join('&');
    return this.http.get<Platform[]>(`${this.baseUrl}?${query}`);
  }

  updatePlatform(platform: Platform): Observable<Platform> {
    return this.http.put<Platform>(`${this.baseUrl}/${platform.id}`, platform);
  }

  addSerieToCatalog(platformId: string, serieId: string): Observable<Platform> {
    return new Observable<Platform>(observer => {
      this.getPlatformById(platformId).pipe(
        switchMap(platform => {
          if (!platform.catalog.includes(serieId)) {
            platform.catalog.push(serieId);

            return this.seriesService.getSerieById(serieId).pipe(
              switchMap(serie => {
                if (!serie.plataformas_id) serie.plataformas_id = [];
                if (!serie.plataformas_id.includes(platformId)) {
                  serie.plataformas_id.push(platformId);

                  return this.http.put<any>(`${this.seriesService['baseUrl']}/${serieId}`, serie).pipe(
                    switchMap(() => this.updatePlatform(platform))
                  );
                }
                return this.updatePlatform(platform);
              })
            );
          } else {
            return this.updatePlatform(platform);
          }
        })
      ).subscribe({
        next: updatedPlatform => {
          observer.next(updatedPlatform);
          observer.complete();
        },
        error: error => observer.error(error)
      });
    });
  }


  addMovieToCatalog(platformId: string, movieId: string): Observable<Platform> {
    return new Observable<Platform>(observer => {
      this.getPlatformById(platformId).pipe(
        switchMap(platform => {
          if (!platform.catalog.includes(movieId)) {
            platform.catalog.push(movieId);

            return this.movieService.getMovieById(movieId).pipe(
              switchMap(movie => {
                if (!movie.plataformas_id) movie.plataformas_id = [];
                if (!movie.plataformas_id.includes(platformId)) {
                  movie.plataformas_id.push(platformId);
                  // Actualiza la película en el backend
                  return this.http.put<any>(`${this.movieService['baseUrl']}/${movieId}`, movie).pipe(
                    switchMap(() => this.updatePlatform(platform))
                  );
                }
                return this.updatePlatform(platform);
              })
            );
          } else {
            return this.updatePlatform(platform);
          }
        })
      ).subscribe({
        next: updatedPlatform => {
          observer.next(updatedPlatform);
          observer.complete();
        },
        error: error => observer.error(error)
      });
    });
  }

  removeMovieFromCatalog(platformId: string, movieId: string): Observable<Platform> {
    return new Observable<Platform>(observer => {
      this.getPlatformById(platformId).pipe(
        switchMap(platform => {
          const movieIndex = platform.catalog.indexOf(movieId);
          if (movieIndex !== -1) {
            platform.catalog.splice(movieIndex, 1);

            return this.movieService.getMovieById(movieId).pipe(
              switchMap(movie => {
                if (movie.plataformas_id) {
                  const platformIndex = movie.plataformas_id.indexOf(platformId);
                  if (platformIndex !== -1) {
                    movie.plataformas_id.splice(platformIndex, 1);

                    return this.http.put<any>(`${this.movieService['baseUrl']}/${movieId}`, movie).pipe(
                      switchMap(() => this.updatePlatform(platform))
                    );
                  }
                }
                return this.updatePlatform(platform);
              })
            );
          } else {
            return this.updatePlatform(platform);
          }
        })
      ).subscribe({
        next: updatedPlatform => {
          observer.next(updatedPlatform);
          observer.complete();
        },
        error: error => observer.error(error)
      });
    });
  }
  removeSerieFromCatalog(platformId: string, serieId: string): Observable<Platform> {
    return new Observable<Platform>(observer => {
      this.getPlatformById(platformId).pipe(
        switchMap(platform => {
          const serieIndex = platform.catalog.indexOf(serieId);
          if (serieIndex !== -1) {
            platform.catalog.splice(serieIndex, 1);

            return this.seriesService.getSerieById(serieId).pipe(
              switchMap(serie => {
                if (serie.plataformas_id) {
                  const platformIndex = serie.plataformas_id.indexOf(platformId);
                  if (platformIndex !== -1) {
                    serie.plataformas_id.splice(platformIndex, 1);

                    return this.http.put<any>(`${this.seriesService['baseUrl']}/${serieId}`, serie).pipe(
                      switchMap(() => this.updatePlatform(platform))
                    );
                  }
                }
                return this.updatePlatform(platform);
              })
            );
          } else {
            return this.updatePlatform(platform);
          }
        })
      ).subscribe({
        next: updatedPlatform => {
          observer.next(updatedPlatform);
          observer.complete();
        },
        error: error => observer.error(error)
      });
    });
  }

}
