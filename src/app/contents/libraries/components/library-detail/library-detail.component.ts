// library-detail.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { LibraryService } from '../../services/library.service';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-library-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library-detail.component.html',
  styleUrl: './library-detail.component.css'
})
export class LibraryDetailComponent implements OnInit, AfterViewInit {
  library: any = null;
  map: L.Map | null = null;

  constructor(
    private route: ActivatedRoute,
    private libraryService: LibraryService,
    private router : Router

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.libraryService.getByIdLibrary(id).subscribe(lib => {
        this.library = lib;
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.library?.ubicaciones?.length) return;

      const icon = L.icon({
        iconUrl: 'assets/RajeIcon.png',
        iconSize: [35, 35],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30]
      });

      this.map = L.map('map-detail').setView(
        [this.library.ubicaciones[0].lat, this.library.ubicaciones[0].lng],
        13
      );

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd'
      }).addTo(this.map!);

      this.library.ubicaciones.forEach((loc: { lat: number; lng: number; direccion: string }) => {
        L.marker([loc.lat, loc.lng], { icon }).addTo(this.map!).bindPopup(loc.direccion);
      });


      this.map.invalidateSize();
    }, 500);
  }
  goBack(): void {
    this.router.navigate(['/tendencies']);
  }
}
