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
import {Movie} from '../../../movies/model/movie.entity';


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
      this.loadDirector(this.serie.directorId);
      this.loadActores();
      this.loadPlatforms(this.serie.plataformasId)
      this.actualizarCalificacionPromedioSerie();
      this.redondearCalificacion();
    }
  }



  loadDirector(directorId: string): void {
    this.directorService.getDirectorById(directorId).subscribe(director => {
      this.director = director;
    });
  }
  loadActores(): void {
    // Asegúrate de que 'this.serie.actoresId' no sea vacío y sea un array
    if (Array.isArray(this.serie?.actoresId) && this.serie.actoresId.length > 0) {
      this.actorService.getActorsByIds(this.serie.actoresId).subscribe(
        (actores) => {
          // Verifica si los actores llegaron correctamente y asigna la respuesta
          if (Array.isArray(actores) && actores.length > 0) {
            this.actores = actores;
          } else {
            console.warn("No se encontraron actores");
            this.actores = [];  // Vacía la lista de actores si no se encontraron
          }
        },
        (error) => {
          console.error("Error loading actors:", error);
          this.actores = [];  // En caso de error, vacía la lista de actores
        }
      );
    } else {
      console.warn("No hay actoresId disponibles o no es un array");
      this.actores = [];  // Vacía la lista si no hay IDs de actores
    }
  }

  loadPlatforms(platformIds: string[]): void {
    if (platformIds?.length > 0) {
      this.platformService.getPlatformsByIds(platformIds).subscribe(plataformas => {
        this.plataformas = plataformas;
      });
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
