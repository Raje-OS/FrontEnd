import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../users/pages/login-form/services/auth.service';
import { Platform } from '../../model/platform.entity';
import { PlatformService } from '../../services/platform.service.service';
import { MovieService } from '../../../movies/services/movie.service.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {SerieService} from '../../../series/services/serie.service.service';

@Component({
  selector: 'app-platform-dashboard',
  templateUrl: './platform-dashboard.component.html',
  styleUrls: ['./platform-dashboard.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NgIf,
    NgFor,
    CommonModule
  ]
})
export class PlatformDashboardComponent implements OnInit {
  currentPlatform: Platform | null = null;
  activeTab: string = 'content';
  allSeries: any[] = [];
  catalogSeries: any[] = [];
  allMovies: any[] = [];
  catalogMovies: any[] = [];
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private platformService: PlatformService,
    private movieService: MovieService,
    private seriesService: SerieService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentPlatform = this.authService.getCurrentPlatform();
    if (!this.currentPlatform) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadMovies();
    this.loadSeries();
  }
  loadSeries(): void {
    this.loading = true;

    this.seriesService.getAllSeries().subscribe(series => {
      this.allSeries = series;

      if (this.currentPlatform && this.currentPlatform.catalog && this.currentPlatform.catalog.length > 0) {
        this.loadCatalogSeries();
      } else {
        this.catalogSeries = [];
        this.loading = false;
      }
    });
  }

  loadCatalogSeries(): void {
    if (!this.currentPlatform || !this.currentPlatform.catalog) {
      this.loading = false;
      return;
    }

    const catalogIds = this.currentPlatform.catalog;
    if (catalogIds.length === 0) {
      this.catalogSeries = [];
      this.loading = false;
      return;
    }

    this.catalogSeries = this.allSeries.filter(serie =>
      catalogIds.includes(serie.id)
    );
    this.loading = false;
  }


  loadMovies(): void {
    this.loading = true;

    // Load all movies
    this.movieService.getAllMovies().subscribe(movies => {
      this.allMovies = movies;

      // If platform has movies in catalog, load them
      if (this.currentPlatform && this.currentPlatform.catalog && this.currentPlatform.catalog.length > 0) {
        this.loadCatalogMovies();
      } else {
        this.catalogMovies = [];
        this.loading = false;
      }
    });
  }



  loadCatalogMovies(): void {
    if (!this.currentPlatform || !this.currentPlatform.catalog) {
      this.loading = false;
      return;
    }

    const catalogIds = this.currentPlatform.catalog;
    if (catalogIds.length === 0) {
      this.catalogMovies = [];
      this.loading = false;
      return;
    }

    this.catalogMovies = this.allMovies.filter(movie =>
      catalogIds.includes(movie.id)
    );
    this.loading = false;
  }

  isSerieInCatalog(serieId: string): boolean {
    return this.currentPlatform?.catalog?.includes(serieId) || false;
  }


  addMovieToCatalog(movieId: string): void {
    if (!this.currentPlatform) return;

    this.loading = true;
    this.platformService.addMovieToCatalog(this.currentPlatform.id, movieId)
      .subscribe(updatedPlatform => {
        this.currentPlatform = updatedPlatform;
        this.authService.platformLogout();
        localStorage.setItem('currentPlatform', JSON.stringify(updatedPlatform));
        this.loadCatalogMovies();
        this.snackBar.open('Película agregada al catálogo', 'Cerrar', {
          duration: 3000,
          panelClass: ['custom-snackbar']
        });
      }, error => {
        console.error('Error adding movie to catalog', error);
        this.loading = false;
        this.snackBar.open('Error al agregar la película', 'Cerrar', {
          duration: 3000,
          panelClass: ['custom-snackbar']
        });
      });
  }

  removeMovieFromCatalog(movieId: string): void {
    if (!this.currentPlatform) return;

    this.loading = true;
    this.platformService.removeMovieFromCatalog(this.currentPlatform.id, movieId)
      .subscribe(updatedPlatform => {
        this.currentPlatform = updatedPlatform;
        this.authService.platformLogout();
        localStorage.setItem('currentPlatform', JSON.stringify(updatedPlatform));
        this.loadCatalogMovies();
        this.snackBar.open('Película eliminada del catálogo', 'Cerrar', {
          duration: 3000,
          panelClass: ['custom-snackbar']
        });
      }, error => {
        console.error('Error removing movie from catalog', error);
        this.loading = false;
        this.snackBar.open('Error al eliminar la película', 'Cerrar', {
          duration: 3000,
          panelClass: ['custom-snackbar']
        });
      });
  }

  addSerieToCatalog(serieId: string): void {
    if (!this.currentPlatform) return;

    this.loading = true;
    this.platformService.addSerieToCatalog(this.currentPlatform.id, serieId)
      .subscribe(updatedPlatform => {
        this.currentPlatform = updatedPlatform;
        this.authService.platformLogout();
        localStorage.setItem('currentPlatform', JSON.stringify(updatedPlatform));
        this.loadCatalogSeries();
        this.snackBar.open('Serie agregada al catálogo', 'Cerrar', {
          duration: 3000,
          panelClass: ['custom-snackbar']
        });
      }, error => {
        console.error('Error adding serie to catalog', error);
        this.loading = false;
        this.snackBar.open('Error al agregar la serie', 'Cerrar', {
          duration: 3000,
          panelClass: ['custom-snackbar']
        });
      });
  }

  removeSerieFromCatalog(serieId: string): void {
    if (!this.currentPlatform) return;

    this.loading = true;
    this.platformService.removeSerieFromCatalog(this.currentPlatform.id, serieId)
      .subscribe(updatedPlatform => {
        this.currentPlatform = updatedPlatform;
        this.authService.platformLogout();
        localStorage.setItem('currentPlatform', JSON.stringify(updatedPlatform));
        this.loadCatalogSeries();
        this.snackBar.open('Serie eliminada del catálogo', 'Cerrar', {
          duration: 3000,
          panelClass: ['custom-snackbar']
        });
      }, error => {
        console.error('Error removing serie from catalog', error);
        this.loading = false;
        this.snackBar.open('Error al eliminar la serie', 'Cerrar', {
          duration: 3000,
          panelClass: ['custom-snackbar']
        });
      });
  }


  isInCatalog(movieId: string): boolean {
    return this.currentPlatform?.catalog?.includes(movieId) || false;
  }

  logout(): void {
    this.authService.platformLogout();
    this.router.navigate(['/login']);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  navigateToStatistics(): void {
    this.router.navigate(['/platform-statistics']);
  }
}
