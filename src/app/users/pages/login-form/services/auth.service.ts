import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Platform } from '../../../../contents/platforms/model/platform.entity';
import { Library } from '../../../../contents/libraries/model/library.entity';
import { LibraryService } from '../../../../contents/libraries/services/library.service';
import { User } from '../../../model/user/user.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformsUrl = `${environment.serverBaseUrl}${environment.platformEndpointPath}`;

  constructor(
    private http: HttpClient,
    private libraryService: LibraryService
  ) {}

  // 🔓 GETTER para mantener compatibilidad con componentes antiguos
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) as User : null;
  }



  // ✅ PLATFORM LOGIN
  platformLogin(email: string, password: string): Observable<Platform | null> {
    return this.http.get<Platform[]>(this.platformsUrl).pipe(
      map(platforms => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        const platform = platforms.find(p =>
          p.email?.trim() === trimmedEmail &&
          p.password?.trim() === trimmedPassword
        );

        if (platform) {
          localStorage.setItem('currentPlatform', JSON.stringify(platform));
          return platform;
        }
        return null;
      }),
      catchError(error => {
        console.error('Platform login failed', error);
        return throwError(() => new Error('Platform login failed'));
      })
    );
  }

  getCurrentPlatform(): Platform | null {
    const platformJson = localStorage.getItem('currentPlatform');
    return platformJson ? JSON.parse(platformJson) : null;
  }

  isPlatformLoggedIn(): boolean {
    return localStorage.getItem('currentPlatform') !== null;
  }

  platformLogout() {
    localStorage.removeItem('currentPlatform');
  }

  // ✅ LIBRARY LOGIN
  libraryLogin(email: string, password: string): Observable<Library | null> {
    return this.libraryService.getByEmail(email).pipe(
      map(library => {
        if (library && library.password === password) {
          localStorage.setItem('currentLibrary', JSON.stringify(library));
          return library;
        }
        return null;
      }),
      catchError(error => {
        console.error('Library login failed', error);
        return throwError(() => new Error('Library login failed'));
      })
    );
  }

  getCurrentLibrary(): Library | null {
    const lib = localStorage.getItem('currentLibrary');
    return lib ? JSON.parse(lib) : null;
  }

  isLibraryLoggedIn(): boolean {
    return localStorage.getItem('currentLibrary') !== null;
  }

  libraryLogout() {
    localStorage.removeItem('currentLibrary');
  }

  // 🔓 Usado por el toolbar y vista inicial
  isAnyUserLoggedIn(): boolean {
    return (
      !!localStorage.getItem('token') || // usuario con token
      !!localStorage.getItem('currentPlatform') ||
      !!localStorage.getItem('currentLibrary')
    );
  }

  // 🔐 Compatibilidad para toolbar y logout global
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentPlatform');
    localStorage.removeItem('currentLibrary');
  }
}
