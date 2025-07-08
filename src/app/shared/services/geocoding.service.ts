import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private baseUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  getCoordinatesFromAddress(address: string): Observable<{ lat: number, lng: number }> {
    const params = {
      q: address,
      format: 'json',
      limit: '1'
    };

    return this.http.get<any[]>(this.baseUrl, { params }).pipe(
      map(res => {
        if (res.length === 0) throw new Error('Dirección no encontrada');
        return { lat: parseFloat(res[0].lat), lng: parseFloat(res[0].lon) };
      }),
      catchError(err => throwError(() => new Error('No se pudo localizar la dirección')))
    );
  }
}
