import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Actor} from '../model/actor.entity';
import {catchError, map} from 'rxjs/operators';


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
    // Crea un array de observables llamando al método `getActorById` para cada ID
    const actorObservables = ids.map(id => this.getActorById(id));

    // Combinamos todas las respuestas usando `forkJoin` para esperar que todas las solicitudes se completen
    return forkJoin(actorObservables).pipe(
      // Filtra cualquier valor null de la respuesta
      map((actors) => actors.filter(actor => actor !== null) as Actor[]),  // Filtramos null y forzamos el tipo a Actor[]
      catchError(error => {
        console.error('Error fetching actors:', error);
        return of([]);  // Devuelve un array vacío en caso de error
      })
    );
  }

// Obtener un actor por ID (utilizando una ruta con un parámetro dinámico)
  getActorById(id: string): Observable<Actor | null> {
    const url = `${environment.serverBaseUrl}/actors/${id}`;
    return this.http.get<Actor>(url).pipe(
      catchError(error => {
        console.error('Error fetching actor:', error);
        return of(null); // Devuelve null en caso de error
      })
    );
  }


}
