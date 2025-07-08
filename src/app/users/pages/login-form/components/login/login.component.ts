import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.loginMode === 'user') {
      this.authService.login(this.username, this.password).subscribe({
        next: user => {
          if (user) this.router.navigate(['/tendencies']);
          else alert('Usuario o contraseña incorrectos');
        },
        error: err => console.error(err)
      });

    } else if (this.loginMode === 'platform') {
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
