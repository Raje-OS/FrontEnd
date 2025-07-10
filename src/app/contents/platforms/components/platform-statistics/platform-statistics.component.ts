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
import {SerieService} from '../../../series/services/serie.service.service';
import {MovieCardComponent} from '../../../movies/components/movie-card/movie-card.component';
import {SerieCardComponent} from '../../../series/components/serie-card/serie-card.component';

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
    CommonModule,
    MovieCardComponent,
    SerieCardComponent
  ]
})
export class PlatformStatisticsComponent implements OnInit {
  currentPlatform: Platform | null = null;
  catalogMovies: any[] = [];
  catalogSeries: any[] = [];
  loading: boolean = false;

  statistics: {
    totalMovies: number;
    totalSeries: number;
    genreDistribution: Record<string, number>;
    topMovie: any | null;
    worstMovie: any | null;
    topSerie: any | null;
    worstSerie: any | null;
  } = {
    totalMovies: 0,
    totalSeries: 0,
    genreDistribution: {},
    topMovie: null,
    worstMovie: null,
    topSerie: null,
    worstSerie: null
  };

  constructor(
    private authService: AuthService,
    private platformService: PlatformService,
    private movieService: MovieService,
    private serieService: SerieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentPlatform = this.authService.getCurrentPlatform();
    if (!this.currentPlatform) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCatalog();
  }

  loadCatalog(): void {
    this.loading = true;
    const platformId = this.currentPlatform?.id;

    this.movieService.getMovies().subscribe(movies => {
      this.catalogMovies = movies.filter(movie =>
        movie.plataformas_id?.includes(platformId)
      );

      this.serieService.getSeries().subscribe(series => {
        this.catalogSeries = series.filter(serie =>
          serie.plataformas_id?.includes(platformId)
        );

        this.calculateStatistics();
        this.loading = false;
      });
    });
  }

  calculateStatistics(): void {
    this.statistics.totalMovies = this.catalogMovies.length;
    this.statistics.totalSeries = this.catalogSeries.length;

    const genreCount: Record<string, number> = {};
    let topMovie = null;
    let worstMovie = null;
    let topSerie = null;
    let worstSerie = null;

    // Películas
    for (const movie of this.catalogMovies) {
      movie.genero?.forEach((g: string) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });

      if (typeof movie.calificacion === 'number') {
        if (!topMovie || movie.calificacion > (topMovie.calificacion || 0)) {
          topMovie = movie;
        }
        if (!worstMovie || movie.calificacion < (worstMovie.calificacion || 5)) {
          worstMovie = movie;
        }
      }
    }

    // Series
    for (const serie of this.catalogSeries) {
      serie.genero?.forEach((g: string) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });

      if (typeof serie.calificacion === 'number') {
        if (!topSerie || serie.calificacion > (topSerie.calificacion || 0)) {
          topSerie = serie;
        }
        if (!worstSerie || serie.calificacion < (worstSerie.calificacion || 5)) {
          worstSerie = serie;
        }
      }
    }

    this.statistics.genreDistribution = genreCount;
    this.statistics.topMovie = topMovie;
    this.statistics.worstMovie = worstMovie;
    this.statistics.topSerie = topSerie;
    this.statistics.worstSerie = worstSerie;
  }

  getGenreKeys(): string[] {
    return Object.keys(this.statistics.genreDistribution);
  }


  navigateToDashboard(): void {
    this.router.navigate(['/platform-dashboard']);
  }

  logout(): void {
    this.authService.platformLogout();
    this.router.navigate(['/login']);
  }


}
