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

// Obtener actores por múltiples IDs (utilizando parámetros de consulta)
  getActorsByIds(ids: string[]): Observable<Actor[]> {
    const queryString = ids.map(id => `ids=${id}`).join('&');  // Creando la cadena de consulta
    const url = `${environment.serverBaseUrl}/series/${queryString}`;  // Llamada HTTP con los parámetros de consulta
    return this.http.get<Actor[]>(url);  // Retorna un observable de actores
  }

// Obtener un actor por ID (utilizando una ruta con un parámetro dinámico)
  getActorById(id: string): Observable<Actor | null> {
    const url = `${environment.serverBaseUrl}/series/${id}`;  // Ruta con el ID como parte de la URL
    return this.http.get<Actor>(url).pipe(
      map(actor => actor ? new Actor(actor) : null)  // Mapea la respuesta a un objeto Actor, o null si no se encuentra
    );
  }

}
