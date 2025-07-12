import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

@Component({
  selector: 'app-language-switcher',
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,

  ],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  protected currentLanguage: string = 'es';
  protected languages: string[] = ['es', 'en'];

  constructor(private translate: TranslateService) {
    this.currentLanguage = this.translate.currentLang;
  }

  useLanguage(language: string): void {
    this.translate.use(language);
    this.currentLanguage = language;
  }

}
