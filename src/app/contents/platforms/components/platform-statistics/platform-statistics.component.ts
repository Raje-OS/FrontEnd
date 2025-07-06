import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../users/pages/login-form/services/auth.service';
import { Platform } from '../../model/platform.entity';
import { PlatformService } from '../../services/platform.service.service';
import { MovieService } from '../../../movies/services/movie.service.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-platform-statistics',
  templateUrl: './platform-statistics.component.html',
  styleUrls: ['./platform-statistics.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf,
    NgFor,
    CommonModule
  ]
})
export class PlatformStatisticsComponent implements OnInit {
  currentPlatform: Platform | null = null;
  catalogMovies: any[] = [];
  loading: boolean = false;
  statistics: any = {
    totalMovies: 0,
    genreDistribution: {},
    yearDistribution: {}
  };

  constructor(
    private authService: AuthService,
    private platformService: PlatformService,
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentPlatform = this.authService.getCurrentPlatform();
    if (!this.currentPlatform) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCatalogMovies();
  }

  loadCatalogMovies(): void {
    this.loading = true;

    if (!this.currentPlatform || !this.currentPlatform.catalog || this.currentPlatform.catalog.length === 0) {
      this.loading = false;
      return;
    }

    // Load all movies first
    this.movieService.getAllMovies().subscribe(movies => {
      // Filter movies that are in the platform's catalog
      this.catalogMovies = movies.filter(movie =>
        this.currentPlatform?.catalog.includes(movie.id)
      );

      this.calculateStatistics();
      this.loading = false;
    });
  }

  calculateStatistics(): void {
    // Total movies
    this.statistics.totalMovies = this.catalogMovies.length;

    // Genre distribution
    const genreCount: {[key: string]: number} = {};
    this.catalogMovies.forEach(movie => {
      if (movie.genero) {
        if (genreCount[movie.genero]) {
          genreCount[movie.genero]++;
        } else {
          genreCount[movie.genero] = 1;
        }
      }
    });
    this.statistics.genreDistribution = genreCount;

    // Year distribution
    const yearCount: {[key: string]: number} = {};
    this.catalogMovies.forEach(movie => {
      if (movie.anio) {
        const year = movie.anio.toString();
        if (yearCount[year]) {
          yearCount[year]++;
        } else {
          yearCount[year] = 1;
        }
      }
    });
    this.statistics.yearDistribution = yearCount;
  }

  navigateToDashboard(): void {
    this.router.navigate(['/platform-dashboard']);
  }

  logout(): void {
    this.authService.platformLogout();
    this.router.navigate(['/login']);
  }

  // Make Object available in the template
  Object = Object;

  getGenreKeys(): string[] {
    return Object.keys(this.statistics.genreDistribution).sort();
  }

  getYearKeys(): string[] {
    return Object.keys(this.statistics.yearDistribution).sort((a, b) => parseInt(b) - parseInt(a));
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }
}
