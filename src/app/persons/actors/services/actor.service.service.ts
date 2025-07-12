import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Actor} from '../model/actor.entity';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private baseUrl = environment.serverBaseUrl + environment.actorEndpointPath;

  constructor(private http: HttpClient) {}

  getActors(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getActorsByIds(ids: string[]): Observable<any[]> {
    const queryString = ids.map(id => `/${id}`).join('&');
    const url = `${this.baseUrl}?${queryString}`;
    return this.http.get<any[]>(url);
  }


  getActorById(id: string): Observable<Actor | null> {
    return this.getActorsByIds([id]).pipe(
      map(actors => actors.length > 0 ? new Actor(actors[0]) : null)
    );
  }
}
