import { Injectable } from '@angular/core';
import {User} from '../../../model/user/user.entity';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Platform } from '../../../../contents/platforms/model/platform.entity';
import {Library} from '../../../../contents/libraries/model/library.entity';
import { LibraryService } from '../../../../contents/libraries/services/library.service'; // Asegúrate que el path sea correcto

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersUrl = `${environment.serverBaseUrl}${environment.userEndpointPath}`;
  private platformsUrl = `${environment.serverBaseUrl}${environment.platformEndpointPath}`;

  constructor(private http: HttpClient, private libraryService: LibraryService) {}

  login(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      map(users => {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        const user = users.find(u =>
          u.userName.trim() === trimmedUsername &&
          u.password.trim() === trimmedPassword
        );

        if (user) {
          // Almacenar el usuario actual
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        }
        return null;
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
  }


  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null || localStorage.getItem('currentPlatform') !== null;
  }

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
          // Almacenar la plataforma actual
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

  //LIBRERIAS
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
}
