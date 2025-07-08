import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-library-card',
  standalone: true,
  imports: [],
  templateUrl: './library-card.component.html',
  styleUrl: './library-card.component.css'
})
export class LibraryCardComponent {
  @Input() imagen: string = '';
  @Input() id: string = '';
  @Output() clickCard = new EventEmitter<string>();

  onClick(): void {
    this.clickCard.emit(this.id);
  }

}
