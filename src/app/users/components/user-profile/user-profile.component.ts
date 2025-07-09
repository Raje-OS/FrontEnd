// src/app/users/components/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../pages/login-form/services/auth.service';
import { ReviewService } from '../../../reviews/services/review.service';
import { User } from '../../model/user/user.entity';
import { Review } from '../../../reviews/model/review.entity';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { UserReviewCardComponent } from '../../../reviews/components/user-review-card/user-review-card.component';
import { RouterLink} from '@angular/router';
import {UpdateReviewComponent} from '../../../reviews/components/update-review/update-review.component';
import {UserDetailService} from '../../services/user-detail/user-detail.service';
import {MovieService} from '../../../contents/movies/services/movie.service.service';
import {BookService} from '../../../contents/books/services/book.service.service';
import {SerieService} from '../../../contents/series/services/serie.service.service';
import {MovieCardComponent} from '../../../contents/movies/components/movie-card/movie-card.component';
import {BookCardComponent} from '../../../contents/books/components/book-card/book-card.component';
import {SerieCardComponent} from '../../../contents/series/components/serie-card/serie-card.component'; // Router imported


@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIcon,
    NgIf,
    NgFor,
    UserReviewCardComponent,
    RouterLink,
    UpdateReviewComponent,
    MovieCardComponent,
    BookCardComponent,
    SerieCardComponent
  ]
})
export class UserProfileComponent implements OnInit {
  protected userData: User | null = null;
  protected loading: boolean = true;
  protected userReviews: Review[] = [];
  selectedReviewToEdit: Review | null = null;
  viewedItems: any[] = [];
  showAllViewed = false;

  constructor(private userService: UserService, private reviewService: ReviewService,
              private authService: AuthService,private userDetailService: UserDetailService, private movieService: MovieService,
              private bookService: BookService, private serieService: SerieService ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadUser();
    this.loadViewedContent();
  }

  private loadUser() {
    this.userData = this.authService.getCurrentUser();
    if (this.userData) {
      this.loadUserReviews(this.userData.id);
    } else {
      console.warn("No hay usuario autenticado");
      this.loading = false;
    }
  }
  onEditReview(review: Review) {
    this.selectedReviewToEdit = review;
  }

  protected loadUserReviews(userId: string) {
    this.reviewService.getReviewsByUserId(userId).subscribe({
      next: (reviews) => {
        this.userReviews = reviews;
        console.log("Reseñas cargadas:", this.userReviews);
        this.loading = false;
      },
      error: (err) => {
        console.error("Error al cargar reseñas:", err);
        this.loading = false;
      }
    });
  }
  removeReview(id: string): void {
    this.userReviews = this.userReviews.filter(review => review.id !== id);
  }

  logout() {
    this.authService.logout();
    this.userData = null;
    this.userReviews = [];
  }
  loadViewedContent(): void {
    const userDetails = this.userDetailService.getByUserId(this.userData!.id);
    userDetails.subscribe(detail => {
      const viewedIds = detail.viewed;
      const allContents: any[] = [];

      viewedIds.forEach((id: string) => {
        // Aquí puedes verificar si es movie, serie o libro
        this.movieService.getMovieById(id).subscribe(movie => allContents.push(movie));
        this.bookService.getBookById(id).subscribe(book => allContents.push(book));
        this.serieService.getSerieById(id).subscribe(serie => allContents.push(serie));
      });

      setTimeout(() => this.viewedItems = this.showAllViewed ? allContents : allContents.slice(0, 3), 500);
    });
  }

  toggleViewed(): void {
    this.showAllViewed = !this.showAllViewed;
    this.loadViewedContent();
  }
}
