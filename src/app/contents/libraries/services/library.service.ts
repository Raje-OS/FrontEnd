import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Library } from '../model/library.entity';
import { environment } from '../../../../environments/environment';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryService extends BaseService<Library> {
  constructor() {
    super();
    this.resourceEndpoint = environment.libraryEndpointPath;
  }

  getByEmail(email: string): Observable<Library | undefined> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.getAll().pipe(
      map(libs => libs.find(lib => lib.email.trim().toLowerCase() === normalizedEmail))
    );
  }

  getByIdLibrary(id: string): Observable<Library> {
    return this.http.get<Library[]>(`${this.resourcePath()}?id=${id}`, this.httpOptions).pipe(
      map(libs => libs[0] || {} as Library)
    );
  }

  addUbicacion(libraryId: string, nuevaUbicacion: { lat: number; lng: number; direccion: string }): Observable<Library> {
    return this.getByIdLibrary(libraryId).pipe(
      switchMap((library: Library) => {
        if (!library.ubicaciones) {
          library.ubicaciones = [];
        }

        library.ubicaciones.push(nuevaUbicacion);

        return this.update(libraryId, library);
      })
    );
  }

  removeUbicacion(libraryId: string, direccion: string): Observable<Library> {
    return this.getByIdLibrary(libraryId).pipe(
      switchMap((library: Library) => {
        library.ubicaciones = library.ubicaciones.filter(loc => loc.direccion !== direccion);
        return this.update(libraryId, library);
      })
    );
  }
}
