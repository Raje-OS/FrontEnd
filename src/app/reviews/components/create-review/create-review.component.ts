import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../../users/pages/login-form/services/auth.service';
import { UserDetailService } from '../../../users/services/user-detail/user-detail.service';
import { Review } from '../../model/review.entity';
import { UserDetail } from '../../../users/model/user-detail/user-detail.entity';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css']
})
export class CreateReviewComponent implements OnInit {
  @Input() contenidoId!: string;
  @Output() reviewCreated = new EventEmitter<void>();

  stars = Array(5).fill(0);
  selectedRating = 0;
  reviewText = '';
  loading = false;

  isFavorite = false;
  isViewed = false;

  userDetail?: UserDetail;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private userDetailService: UserDetailService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.userDetailService.getByUserId(user.id).subscribe({
      next: (detail) => {
        this.userDetail = detail;
        this.isFavorite = detail.favorites.includes(this.contenidoId);
        this.isViewed = detail.viewed.includes(this.contenidoId);
      },
      error: err => console.error('Error al obtener UserDetail:', err)
    });
  }

  selectStar(rating: number): void {
    this.selectedRating = rating;
  }

  onHeartClick(): void {
    if (!this.userDetail) return;

    const alreadyFavorite = this.userDetail.favorites.includes(this.contenidoId);

    if (alreadyFavorite) {
      this.userDetail.favorites = this.userDetail.favorites.filter(id => id !== this.contenidoId);
    } else {
      this.userDetail.favorites.push(this.contenidoId);
    }

    this.userDetailService.update(this.userDetail.id, this.userDetail).subscribe({
      next: () => {
        this.isFavorite = !alreadyFavorite;
        console.log(` Favorito ${alreadyFavorite ? 'removido' : 'añadido'}`);
      },
      error: err => console.error(' Error al actualizar favoritos', err)
    });
  }

  onEyeClick(): void {
    if (!this.userDetail) return;

    const alreadyViewed = this.userDetail.viewed.includes(this.contenidoId);

    if (alreadyViewed) {
      this.userDetail.viewed = this.userDetail.viewed.filter(id => id !== this.contenidoId);
    } else {
      this.userDetail.viewed.push(this.contenidoId);
    }

    this.userDetailService.update(this.userDetail.id, this.userDetail).subscribe({
      next: () => {
        this.isViewed = !alreadyViewed;
        console.log(`👁️ Visto ${alreadyViewed ? 'removido' : 'marcado'}`);
      },
      error: err => console.error('❌ Error al actualizar viewed', err)
    });
  }

  submitReview(): void {
    this.onEyeClick()
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('Debes iniciar sesión para dejar un review');
      return;
    }

    this.loading = true;

    this.reviewService.getAllReviews().subscribe({
      next: (reviews) => {
        const ids = reviews.map(r => parseInt(r.id.replace('RV', ''), 10));
        const nextIdNum = Math.max(...ids, 0) + 1;
        const newId = `RV${String(nextIdNum).padStart(3, '0')}`;

        const review: Review = {
          id: newId,
          userId: user.id,
          contenidoId: this.contenidoId,
          rating: this.selectedRating,
          text: this.reviewText.trim(),
          createdAt: new Date()
        };

        this.reviewService.create(review).subscribe({
          next: () => {
            this.reviewCreated.emit();
            this.selectedRating = 0;
            this.reviewText = '';
            this.loading = false;
          },
          error: err => {
            console.error('Error al crear review:', err);
            alert('No se pudo enviar la reseña.');
            this.loading = false;
          }
        }); 
        window.location.reload();
      },
      error: err => {
        console.error('Error al cargar reviews existentes:', err);
        alert('No se pudo generar el ID.');
        this.loading = false;
      }
    });
  }
}
