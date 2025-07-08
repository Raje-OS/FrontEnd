import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-library-card',
  imports: [],
  templateUrl: './library-card.component.html',
  standalone: true,
  styleUrl: './library-card.component.css'
})
export class LibraryCardComponent {
  @Input() imagen: string = '';
}
