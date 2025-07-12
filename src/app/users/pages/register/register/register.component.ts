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
    private cdr: ChangeDetectorRef
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
        const nextId = Math.max(...userIds) + 1;
        const newUserId = `US${String(nextId).padStart(3, '0')}`;
        const exists = users.some(user => user.email === this.email);
        if (exists) {
          console.log('Correo ya existe');
          this.emailExists = true;
          this.cdr.detectChanges(); // ← Forzar detección de cambios
          return;
        }
        this.emailExists = false;

        const newUser: User = {
          id: newUserId,
          firstName: firstName,
          lastName: lastName,
          userName: this.username,
          email: this.email,
          password: this.password,
          platforms: [],
          images: 'https://i.pinimg.com/236x/09/02/86/090286be7ffa5bc199ad0bb34af40d68.jpg'
        };

        this.userService.registerUser(newUser).subscribe({
          next: () => {
            // Obtener todos los userDetails para generar el nuevo ID
            this.userDetailService.getAll().subscribe({
              next: (details) => {
                const detailIds = details.map(detail => detail.id.replace("UD", "")).map(Number);
                const nextDetailId = Math.max(...detailIds, 0) + 1;
                const newDetailId = `UD${String(nextDetailId).padStart(3, '0')}`;

                const userDetail: UserDetail = {
                  id: newDetailId,
                  userId: newUserId,
                  favorites: [],
                  viewed: []
                };

                this.userDetailService.create(userDetail).subscribe({
                  next: () => {
                    console.log('UserDetail creado');
                    this.router.navigate(['/login']);
                  },
                  error: err => {
                    console.error('Error creando UserDetail:', err);
                    this.router.navigate(['/login']);
                  }
                });
              },
              error: err => {
                console.error('Error obteniendo userDetails:', err);
                this.router.navigate(['/login']);
              }
            });
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Error al registrar el usuario';
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar los usuarios';
      }
    });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
