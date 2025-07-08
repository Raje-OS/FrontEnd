import { Routes } from '@angular/router';
import { LoginComponent } from './users/pages/login-form/components/login/login.component';
import { UserProfileComponent } from './users/components/user-profile/user-profile.component';
import { RegisterComponent } from './users/pages/register/register/register.component';
import { TendenciasComponent } from './public/components/Tendencias/tendencias/tendencias.component';
import { ParatiComponent } from './public/pages/parati/parati.component';
import { FavoritosComponent } from './public/components/Favoritos/favoritos/favoritos.component';
import {MovieDetailComponent} from './contents/movies/components/movie-detail/movie-detail.component';
import {ActorProfileComponent} from './persons/actors/components/actor-profile/actor-profile.component';
import {DirectorProfileComponent} from './persons/directors/components/director-profile/director-profile.component';
import {AuthorProfileComponent} from './persons/authors/components/author-profile/author-profile.component';
import {PlatformListComponent} from './contents/platforms/components/platform-list/platform-list.component';
import {PlatformDashboardComponent} from './contents/platforms/components/platform-dashboard/platform-dashboard.component';
import {EditProfileComponent}  from './users/components/edit-profile/edit-profile.component';
import {ContentDetailComponent} from './contents/pages/content-detail/content-detail.component';
import {ListsPageComponent} from './lists/pages/lists.page/lists.page.component';
import {ListDetailComponent} from './lists/components/list-detail/list-detail.component';
import {TopCategoryComponent} from './public/components/top-category/top-category.component';
import {PlatformStatisticsComponent} from './contents/platforms/components/platform-statistics/platform-statistics.component';
import {SearchContentComponent} from './contents/pages/search-content/search-content.component';
import {LibraryDashboardComponent} from './contents/libraries/components/library-dashboard/library-dashboard.component';
import {
  LibraryStatisticsComponent
} from './contents/libraries/components/library-statistics/library-statistics.component';
import {LibraryMapComponent} from './contents/libraries/components/library-map/library-map.component';
import {LibraryDetailComponent} from './contents/libraries/components/library-detail/library-detail.component';


export const routes: Routes = [
  // 🔐 Auth
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 👤 Usuario
  { path: 'profile', component: UserProfileComponent },
  {path: 'editmode', component: EditProfileComponent},

  // 📚 Contenidos
  { path: 'tendencies', component: TendenciasComponent },
  { path: 'foryou', component: ParatiComponent },
  { path: 'favorites', component: FavoritosComponent },
  { path: 'content/:type/:id', component: ContentDetailComponent },
  { path: 'top/:type', component: TopCategoryComponent },
  { path: 'busqueda', component:SearchContentComponent  },
  // 🎬 Detalle de contenido
  { path: 'movies/:id', component: MovieDetailComponent },

  // 👥 Perfiles de personas
  { path: 'actor/:id', component: ActorProfileComponent },
  { path: 'director/:id', component: DirectorProfileComponent },
  { path: 'author/:id', component: AuthorProfileComponent },

  // 💻 Plataformas
  { path: 'platforms', component: PlatformListComponent },
  { path: 'platform-dashboard', component: PlatformDashboardComponent },
  { path: 'platform-statistics', component: PlatformStatisticsComponent },

  // 📂 Rutas de listas personalizadas
  { path: 'lists', component: ListsPageComponent },
  {path: 'lists/:id', component: ListDetailComponent},

  //librerias rutas
  { path: 'library-dashboard', component: LibraryDashboardComponent },
  {path: 'library-statistics', component: LibraryStatisticsComponent },
  {path: 'library-map', component: LibraryMapComponent },
  { path: 'libraries/:id', component: LibraryDetailComponent },
  // ⚠️ Fallback
  { path: '**', redirectTo: 'login' }




];
