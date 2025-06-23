import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../pages/login-form/services/auth.service';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user/user.entity';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../../shared/components/base-form.component';
import {NgIf} from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-profile',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './edit-profile.component.html',
  standalone: true,
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent extends BaseFormComponent implements OnInit {
  editForm!: FormGroup;
  currentUser!: User;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {super();}
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user;

      const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

      this.editForm = this.fb.group({
        images: [user.images, [Validators.required]],
        fullName: [fullName, [Validators.required]],
        userName: [user.userName, [Validators.required]],
        email: [user.email, [Validators.required, Validators.email]]
      });
    }
  }


  onSave(): void {
    if (this.editForm.valid && this.currentUser?.id) {
      const nameParts = this.editForm.value.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const updatedUser: User = {
        ...this.currentUser,
        firstName,
        lastName,
        userName: this.editForm.value.userName,
        email: this.editForm.value.email,
        images: this.editForm.value.images
      };

      this.userService.update(this.currentUser.id, updatedUser).subscribe({
        next: (res) => {
          localStorage.setItem('currentUser', JSON.stringify(res));
          alert('Perfil actualizado correctamente.');
        },
        error: () => alert('Error al guardar los cambios.')
      });
    } else {
      this.editForm.markAllAsTouched();
    }
  }
  goBack(): void {
    this.router.navigate(['/profile']);
  }
}

