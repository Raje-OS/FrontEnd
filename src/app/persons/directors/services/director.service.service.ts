import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import {Author} from '../../authors/model/author.entity';
import {Director} from '../model/director.entity';

@Injectable({
  providedIn: 'root'
})
export class DirectorService {
  private baseUrl = environment.serverBaseUrl + environment.directorEndpointPath;

  constructor(private http: HttpClient) {}

  getDirectors(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getDirectorById(id: string): Observable<Director> {
    // Esto devuelve solo el primer director que coincida con el ID
    return this.http.get<Director>(`${environment.serverBaseUrl}/directors/${id}`);
  }


}
