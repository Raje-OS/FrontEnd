import { Component, Input, OnInit } from '@angular/core';
import {Serie} from '../../model/serie.entity';
import {DirectorService} from '../../../../persons/directors/services/director.service.service';
import {ActorService} from '../../../../persons/actors/services/actor.service.service';
import {PlatformService} from '../../../platforms/services/platform.service.service';
import {PlatformCardComponent} from '../../../platforms/components/platform-card/platform-card.component';
import {ActorCardComponent} from '../../../../persons/actors/components/actor-card/actor-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {DirectorCardComponent} from '../../../../persons/directors/components/director-card/director-card.component';
import {ReviewService} from '../../../../reviews/services/review.service';
import {SerieService} from '../../services/serie.service.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-serie-detail',
  standalone: true,
  templateUrl: './serie-detail.component.html',
  imports: [
    PlatformCardComponent,
    ActorCardComponent,
    NgIf,
    NgForOf,
    DirectorCardComponent
  ],
  styleUrls: ['./serie-detail.component.css']
})
export class SerieDetailComponent implements OnInit {
  @Input() serie: Serie | null = null;
  director: any = null;
  actores: any[] = [];
  plataformas: any[] = [];

  constructor(
    private directorService: DirectorService,
    private actorService: ActorService,
    private platformService: PlatformService,
    private reviewService: ReviewService,
    private serieService: SerieService,
    private router: Router
  ) {}

  roundedRating = 0;

  ngOnInit(): void {
    if (this.serie) {
      this.loadDirector();
      this.loadActores();
      this.loadPlataformas();
      this.actualizarCalificacionPromedioSerie();
      this.redondearCalificacion();
    }
  }

  loadDirector(): void {
    if (this.serie?.director_id) {
      this.directorService.getDirectorById(this.serie.director_id).subscribe(
        (director) => {
          this.director = director;
        },
        (error) => console.error("Error loading director:", error)
      );
    }
  }

  loadActores(): void {
    if (this.serie?.actores_id.length) {
      this.actorService.getActorsByIds(this.serie.actores_id).subscribe(
        (actores) => {
          this.actores = actores;
        },
        (error) => console.error("Error loading actors:", error)
      );
    }
  }

  loadPlataformas(): void {
    if (this.serie?.plataformas_id.length) {
      this.platformService.getPlatformsByIds(this.serie.plataformas_id).subscribe(
        (plataformas) => {
          this.plataformas = plataformas;
        },
        (error) => console.error("Error loading platforms:", error)
      );
    }
  }

  actualizarCalificacionPromedioSerie() {
    if (!this.serie?.id) return;

    this.reviewService.getReviewsByContenidoId(this.serie.id).subscribe(reviews => {
      if (!reviews || reviews.length === 0) return;

      const suma = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
      const promedio = Math.round((suma / reviews.length) * 10) / 10;

      if (this.serie) {
        this.serie.calificacion = promedio;
        this.serieService.updateSerie(this.serie).subscribe({
          next: () => console.log('Calificación de serie actualizada'),
          error: err => console.error('Error al actualizar calificación de serie', err)
        });
      }
    });
  }

  redondearCalificacion(): void {
    if (this.serie?.calificacion != null) {
      this.roundedRating = Math.round(this.serie.calificacion);
    }
  }

}
