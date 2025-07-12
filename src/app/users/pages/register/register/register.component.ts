import {ChangeDetectorRef, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserDetailService } from '../../../services/user-detail/user-detail.service';
import { User } from '../../../model/user/user.entity';
import { UserDetail } from '../../../model/user-detail/user-detail.entity';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {SignUpRequest} from '../../../../iam/model/sign-up.request';
import {AuthenticationService} from '../../../../iam/services/authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule]
})
export class RegisterComponent {



  protected name: string = '';
  protected username: string = '';
  protected email: string = '';
  protected password: string = '';
  protected confirmPassword: string = '';
  protected errorMessage: string = '';

  emailExists: boolean = false;

  constructor(
    private userService: UserService,
    private userDetailService: UserDetailService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthenticationService
  ) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const nameParts = this.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    this.userService.getAll().subscribe({
      next: (users) => {
        const userIds = users.map(user => user.id.replace("US", "")).map(Number);
        const nextId = Math.max(...userIds, 0) + 1;
        const newUserId = `US${String(nextId).padStart(3, '0')}`;

        const exists = users.some(user => user.email === this.email);
        if (exists) {
          this.emailExists = true;
          this.cdr.detectChanges();
          return;
        }

        this.emailExists = false;

        const signUpRequest = new SignUpRequest(
          newUserId,
          firstName,
          lastName,
          this.username,
          this.email,
          this.password,
          [], // platforms
          'https://i.pinimg.com/236x/09/02/86/090286be7ffa5bc199ad0bb34af40d68.jpg' // imagen
        );

        this.authenticationService.signUp(signUpRequest).subscribe({
          next: (signUpResponse) => {
            localStorage.setItem('token', signUpResponse.token);
            const userDetail: UserDetail = {
              id: '',
              userId: signUpResponse.id,
              favorites: [],
              viewed: []
            };

            this.userDetailService.getAll().subscribe({
              next: (details) => {
                const detailIds = details.map(detail => detail.id.replace("UD", "")).map(Number);
                const nextDetailId = Math.max(...detailIds, 0) + 1;
                userDetail.id = `UD${String(nextDetailId).padStart(3, '0')}`;

                this.userDetailService.create(userDetail).subscribe({
                  next: () => {
                    console.log('UserDetail creado');
                    this.router.navigate(['/tendencies']);
                  },
                  error: err => {
                    console.error('Error creando UserDetail:', err);
                    this.router.navigate(['/tendencies']);
                  }
                });
              },
              error: err => {
                console.error('Error obteniendo userDetails:', err);
                this.router.navigate(['/tendencies']);
              }
            });
          },
          error: err => {
            console.error('Error en registro:', err);
            this.errorMessage = 'Error al registrar usuario.';
          }
        });
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Error al cargar usuarios';
      }
    });
  }


  goBack() {
    this.router.navigate(['/login']);
  }
}
