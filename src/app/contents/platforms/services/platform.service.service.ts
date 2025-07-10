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



}
