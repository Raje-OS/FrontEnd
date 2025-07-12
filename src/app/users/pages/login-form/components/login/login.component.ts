import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {SignInRequest} from '../../../../../iam/model/sign-in.request';
import {AuthenticationService} from '../../../../../iam/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    NgIf
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  loginMode: 'user' | 'platform' | 'library' = 'user';

  constructor(private authService: AuthService, private router: Router,
              private authenticationService: AuthenticationService,) {}

  login() {
    if (this.loginMode === 'user') {
      const request = new SignInRequest(this.username, this.password);
      this.authenticationService.signIn(request).subscribe({
        next: (response) => {
          if (response && response.token) {
            // Guardar el token en localStorage
            localStorage.setItem('token', response.token);

            // 🆕 Guardar también el currentUser para que lo lea el resto del sistema
            localStorage.setItem('currentUser', JSON.stringify(response));


            // Actualizar estados internos del servicio
            this.authenticationService['signedIn'].next(true);
            this.authenticationService['signedInUserId'].next(response.id);
            this.authenticationService['signedInUsername'].next(response.username);

            this.router.navigate(['/tendencies']);
          } else {
            alert('Usuario o contraseña incorrectos');
          }
        },
        error: (err) => {
          console.error(err);
          alert('Error al iniciar sesión');
        }
      });
    }




    else if (this.loginMode === 'platform') {
      this.authService.platformLogin(this.email, this.password).subscribe({
        next: platform => {
          if (platform) this.router.navigate(['/platform-dashboard']);
          else alert('Email o contraseña incorrectos');
        },
        error: err => console.error(err)
      });

    } else if (this.loginMode === 'library') {
      this.authService.libraryLogin(this.email, this.password).subscribe({
        next: (library) => {
          if (library) {
            this.router.navigate(['/library-dashboard']);
          } else {
            alert('Email o contraseña incorrectos');
          }
        },
        error: (error) => console.error(error)
      });

    }
  }


  register() {
    this.router.navigate(['/register']);
  }
}
