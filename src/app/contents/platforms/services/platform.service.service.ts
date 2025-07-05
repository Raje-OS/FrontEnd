import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Platform } from '../model/platform.entity';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private baseUrl = environment.serverBaseUrl + environment.platformEndpointPath;

  constructor(private http: HttpClient) {}

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

  addMovieToCatalog(platformId: string, movieId: string): Observable<Platform> {
    return new Observable<Platform>(observer => {
      this.getPlatformById(platformId).subscribe(platform => {
        if (!platform.catalog.includes(movieId)) {
          platform.catalog.push(movieId);
          this.updatePlatform(platform).subscribe(updatedPlatform => {
            observer.next(updatedPlatform);
            observer.complete();
          }, error => {
            observer.error(error);
          });
        } else {
          observer.next(platform);
          observer.complete();
        }
      }, error => {
        observer.error(error);
      });
    });
  }

  removeMovieFromCatalog(platformId: string, movieId: string): Observable<Platform> {
    return new Observable<Platform>(observer => {
      this.getPlatformById(platformId).subscribe(platform => {
        platform.catalog = platform.catalog.filter(id => id !== movieId);
        this.updatePlatform(platform).subscribe(updatedPlatform => {
          observer.next(updatedPlatform);
          observer.complete();
        }, error => {
          observer.error(error);
        });
      }, error => {
        observer.error(error);
      });
    });
  }
}
