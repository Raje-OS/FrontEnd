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
  allMovies: any[] = [];
  allSeries: any[] = [];
  catalogMovies: any[] = [];
  catalogSeries: any[] = [];
  availableMovies: any[] = [];
  availableSeries: any[] = [];
  loading: boolean = false;

  constructor(
    private authService: AuthService,
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
    this.loadContent();
  }

  loadContent(): void {
    this.loading = true;
    this.movieService.getMovies().subscribe(movies => {
      this.allMovies = movies;
      this.updateMovieLists();
      this.seriesService.getSeries().subscribe(series => {
        this.allSeries = series;
        this.updateSeriesLists();
        this.loading = false;
      });
    });
  }

  updateMovieLists(): void {
    const pid = this.currentPlatform?.id;
    this.catalogMovies = this.allMovies.filter(m => m.plataformas_id?.includes(pid));
    this.availableMovies = this.allMovies.filter(m => !m.plataformas_id?.includes(pid));
  }

  updateSeriesLists(): void {
    const pid = this.currentPlatform?.id;
    this.catalogSeries = this.allSeries.filter(s => s.plataformas_id?.includes(pid));
    this.availableSeries = this.allSeries.filter(s => !s.plataformas_id?.includes(pid));
  }

  addMovieToCatalog(movie: any): void {
    if (!this.currentPlatform) return;
    movie.plataformas_id = movie.plataformas_id || [];
    if (!movie.plataformas_id.includes(this.currentPlatform.id)) {
      movie.plataformas_id.push(this.currentPlatform.id);
      this.movieService.updateMovie(movie).subscribe(() => {
        this.loadContent();
        this.snackBar.open('Película añadida al catálogo', '', { duration: 1500 });
      });
    }
  }

  removeMovieFromCatalog(movie: any): void {
    if (!this.currentPlatform) return;
    movie.plataformas_id = (movie.plataformas_id || []).filter((id: string) => id !== this.currentPlatform?.id);
    this.movieService.updateMovie(movie).subscribe(() => {
      this.loadContent();
      this.snackBar.open('Película eliminada del catálogo', '', { duration: 1500 });
    });
  }

  addSerieToCatalog(serie: any): void {
    if (!this.currentPlatform) return;
    serie.plataformas_id = serie.plataformas_id || [];
    if (!serie.plataformas_id.includes(this.currentPlatform.id)) {
      serie.plataformas_id.push(this.currentPlatform.id);
      this.seriesService.updateSerie(serie).subscribe(() => {
        this.loadContent();
        this.snackBar.open('Serie añadida al catálogo', '', { duration: 1500 });
      });
    }
  }

  removeSerieFromCatalog(serie: any): void {
    if (!this.currentPlatform) return;
    serie.plataformas_id = (serie.plataformas_id || []).filter((id: string) => id !== this.currentPlatform?.id);
    this.seriesService.updateSerie(serie).subscribe(() => {
      this.loadContent();
      this.snackBar.open('Serie eliminada del catálogo', '', { duration: 1500 });
    });
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
