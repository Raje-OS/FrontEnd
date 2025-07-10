import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformService } from '../../services/platform.service.service';
import { PlatformCardComponent } from '../platform-card/platform-card.component';
import { NgForOf } from '@angular/common';
import { UserService } from '../../../../users/services/user.service';
import { User } from '../../../../users/model/user/user.entity';
import { switchMap, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import {AuthService} from '../../../../users/pages/login-form/services/auth.service';

@Component({
  selector: 'app-platform-list',
  templateUrl: './platform-list.component.html',
  imports: [
    PlatformCardComponent,
    NgForOf
  ],
  standalone: true,
  styleUrls: ['./platform-list.component.css']
})
export class PlatformListComponent implements OnInit {
  subscribedPlatformIds: string[] = [];
  allPlatforms: any[] = [];
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private platformService: PlatformService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      alert('Usuario no autenticado.');
      return;
    }

    this.userService.getUserById(this.currentUser.id).subscribe(user => {
      this.subscribedPlatformIds = user.platforms ?? [];
      this.loadAllPlatforms();
    });
  }

  loadAllPlatforms() {
    this.platformService.getAllPlatforms().subscribe(platforms => {
      this.allPlatforms = platforms;
    });
  }

  isSubscribed(id: string): boolean {
    return this.subscribedPlatformIds.includes(id);
  }

  toggleSubscription(id: string) {
    const index = this.subscribedPlatformIds.indexOf(id);
    if (index >= 0) {
      this.subscribedPlatformIds.splice(index, 1);
    } else {
      this.subscribedPlatformIds.push(id);
    }

    if (!this.currentUser) {
      console.error("No hay usuario autenticado");
      return;
    }

    const userId = this.currentUser.id;

    this.userService.getUserById(userId).pipe(
      switchMap((user: User) => {
        if (!user) return throwError(() => new Error('Usuario no encontrado'));
        const updatedUser: User = {
          ...user,
          platforms: [...this.subscribedPlatformIds]
        };
        return this.userService.update(userId, updatedUser);
      }),
      catchError(err => {
        console.error('Error al guardar automáticamente:', err);
        alert('Error al actualizar la suscripción');
        return of(null);
      })
    ).subscribe((response) => {
      if (response) {
        console.log("Suscripciones actualizadas automáticamente:", this.subscribedPlatformIds);
      }
    });
  }



}
