import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './iam/services/authentication.service';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, ToolbarComponent, NgIf, AsyncPipe]
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  protected readonly isLoggedIn = this.authService.isSignedIn;
  protected readonly currentUrl = computed(() => this.router.url);

  shouldShowToolbar() {
    const noToolbarRoutes = ['/login', '/register'];
    return this.isLoggedIn && !noToolbarRoutes.includes(this.router.url);
  }
}
