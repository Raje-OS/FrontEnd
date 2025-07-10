import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-platform-card',
  templateUrl: './platform-card.component.html',
  standalone: true,
  styleUrls: ['./platform-card.component.css']
})
export class PlatformCardComponent {
  @Input() imagen: string = '';

}
