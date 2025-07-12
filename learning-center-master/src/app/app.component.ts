import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatAnchor} from '@angular/material/button';
import {LanguageSwitcherComponent} from './public/components/language-switcher/language-switcher.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FooterContentComponent} from './public/components/footer-content/footer-content.component';
import {AuthenticationSectionComponent} from './iam/components/authentication-section/authentication-section.component';


/**
 * Root component of the Learning Center application.
 * Provides the main layout structure including navigation toolbar and routing outlet.
 *
 * @remarks
 * This component:
 * - Initializes the application's translation service
 * - Provides the main navigation structure
 * - Serves as the application shell
 *
 * @example
 * ```html
 * <!-- In index.html -->
 * <app-root></app-root>
 * ```
 */
@Component({
  selector: 'app-root',
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatAnchor,
    RouterLink,
    LanguageSwitcherComponent,
    RouterOutlet,
    RouterLinkActive,
    TranslatePipe,
    FooterContentComponent,
    AuthenticationSectionComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  /** Application title */
  title = 'learning-center';

  /**
   * Navigation options for the main menu.
   * Each option contains a route link and a translation label key.
   */
  options = [
    {link: '/home', label: 'home'},
    {link: '/about', label: 'about'},
    {link: '/learning/courses', label: 'courses'},
  ]

  /**
   * Creates an instance of AppComponent.
   * Initializes the translation service with English as the default language.
   *
   * @param translate - The translation service for handling internationalization
   */
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
