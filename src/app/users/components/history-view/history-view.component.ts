import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { AuthService } from '../../pages/login-form/services/auth.service';
import { UserDetailService } from '../../services/user-detail/user-detail.service';
import { MovieService } from '../../../contents/movies/services/movie.service.service';
import { SerieService } from '../../../contents/series/services/serie.service.service';
import { BookService } from '../../../contents/books/services/book.service.service';
import { MovieCardComponent } from '../../../contents/movies/components/movie-card/movie-card.component';
import { SerieCardComponent } from '../../../contents/series/components/serie-card/serie-card.component';
import { BookCardComponent } from '../../../contents/books/components/book-card/book-card.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-history-view',
  standalone: true,
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.css'],
  imports: [CommonModule, MovieCardComponent, SerieCardComponent, BookCardComponent]
})
export class HistoryViewComponent implements OnInit {
  viewedItems: any[] = [];

  constructor(
    private authService: AuthService,
    private userDetailService: UserDetailService,
    private movieService: MovieService,
    private serieService: SerieService,
    private bookService: BookService,
    private router : Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.warn('No hay usuario autenticado');
      return;
    }

    console.log('Usuario actual:', user);

    this.userDetailService.getAll().subscribe(details => {
      const userDetail = details.find((d: any) => d.userId === user.id);
      if (!userDetail || !userDetail.viewed) {
        console.warn('No se encontró userDetail o no hay historial');
        return;
      }

      const viewedIds: string[] = userDetail.viewed;
      console.log('IDs en el historial:', viewedIds);

      const requests = viewedIds.map(id => {
        console.log('Procesando ID:', id);
        if (id.startsWith('MV')) {
          return this.movieService.getMovieById(id);
        } else if (id.startsWith('SR')) {
          return this.serieService.getSerieById(id);
        } else if (id.startsWith('BK')) {
          return this.bookService.getBookById(id);
        } else {
          console.warn('ID no reconocido:', id);
          return of(null);
        }
      });

      forkJoin(requests).subscribe(results => {
        console.log('Resultados de forkJoin:', results);
        console.log('Debugging cada item cargado:');
        results.forEach(item => {
          if (!item) return;
          console.log(`ID: ${item.id}, Título: ${item.titulo}, Imagen: ${item.imagen}`);
        });

        this.viewedItems = results.filter(item => item && item.id);
        console.log('Items válidos mostrados:', this.viewedItems);
      });
    });
  }
  eliminarDelHistorial(id: string): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.userDetailService.getAll().subscribe(details => {
      const userDetail = details.find((d: any) => d.userId === user.id);
      if (!userDetail || !userDetail.viewed) return;

      // Filtrar el ID que se desea eliminar
      userDetail.viewed = userDetail.viewed.filter((viewedId: string) => viewedId !== id);

      this.userDetailService.updateUserDetails(userDetail).subscribe(() => {
        // Eliminar también del array local
        this.viewedItems = this.viewedItems.filter(item => item.id !== id);
        console.log(`Eliminado del historial: ${id}`);
      });
    });
  }
  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
