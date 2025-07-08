import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../users/pages/login-form/services/auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { Library } from '../../model/library.entity';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-library-toolbar',
  templateUrl: './library-toolbar.component.html',
  styleUrls: ['./library-toolbar.component.css'],
  imports: [
    MatToolbar,
    MatButton,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  standalone: true
})
export class LibraryToolbarComponent implements OnInit {
  currentLibrary: Library | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentLibrary = this.authService.getCurrentLibrary();
  }

  logout(): void {
    this.authService.libraryLogout();
    this.router.navigate(['/login']);
  }
}
