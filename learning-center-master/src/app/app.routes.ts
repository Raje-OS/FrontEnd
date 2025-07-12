import {Routes} from '@angular/router';
import {HomeComponent} from './public/pages/home/home.component';
import {SignUpComponent} from './iam/pages/sign-up/sign-up.component';
import {SignInComponent} from './iam/pages/sign-in/sign-in.component';
import {authenticationGuard} from './iam/services/authentication.guard';

const AboutComponent = () => import('./public/pages/about/about.component').then(m => m.AboutComponent);
const CourseManagementComponent = () => import('./learning/pages/course-management/course-management.component').then(m => m.CourseManagementComponent);
const PageNotFoundComponent = () => import('./public/pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);

const baseTitle = 'ACME Learning Center';

export const routes: Routes = [
  { path: 'home',             component:      HomeComponent,                title: `${baseTitle} | Home` },
  { path: 'about',            loadComponent:  AboutComponent,               title: `${baseTitle} | About` },
  { path: 'learning/courses', loadComponent:  CourseManagementComponent,    title: `${baseTitle} | Courses`, canActivate: [authenticationGuard]},
  { path: 'sign-in',          component:      SignInComponent,              title: `${baseTitle} | Sign-In` },
  { path: 'sign-up',          component:      SignUpComponent,              title: `${baseTitle} | Sign-Up` },
  { path: '',                 redirectTo:     '/home', pathMatch: 'full' },
  { path: '**',               loadComponent:  PageNotFoundComponent,        title: `${baseTitle} | Page Not Found` },
];
