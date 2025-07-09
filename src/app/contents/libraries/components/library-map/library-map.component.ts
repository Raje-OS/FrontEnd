import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from '../../../../users/pages/login-form/services/auth.service';
import { Library } from '../../model/library.entity';
import { GeocodingService } from '../../../../shared/services/geocoding.service';
import { LibraryToolbarComponent } from '../library-toolbar/library-toolbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {LibraryService} from '../../services/library.service';

@Component({
  selector: 'app-library-map',
  templateUrl: './library-map.component.html',
  styleUrls: ['./library-map.component.css'],
  standalone: true,
  imports: [
    LibraryToolbarComponent,
    FormsModule,
    CommonModule
  ]
})
export class LibraryMapComponent implements OnInit, AfterViewInit {
  currentLibrary: Library | null = null;
  map: L.Map | null = null;

  newDireccion = '';
  newNombre = '';

  constructor(
    private authService: AuthService,
    private geocodingService: GeocodingService,
    private libraryService: LibraryService

  ) {}

  ngOnInit(): void {
    this.currentLibrary = this.authService.getCurrentLibrary();
  }

  ngAfterViewInit(): void {
    if (!this.currentLibrary || !this.currentLibrary.ubicaciones) return;

    const customIcon = L.icon({
      iconUrl: 'assets/RajeIcon.png',
      iconSize: [35, 35],
      iconAnchor: [17, 34],
      popupAnchor: [0, -30]
    });

    this.map = L.map('map').setView(
      [this.currentLibrary.ubicaciones[0].lat, this.currentLibrary.ubicaciones[0].lng],
      13
    );

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd'
    }).addTo(this.map);

    this.currentLibrary.ubicaciones.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(this.map!);

      marker.bindPopup(`
    <strong>${loc.direccion}</strong><br>
    <button class="delete-btn" data-dir="${loc.direccion}">🗑️ Eliminar</button>
  `);

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.querySelector(`.delete-btn[data-dir="${loc.direccion}"]`) as HTMLButtonElement;
          if (btn) {
            btn.addEventListener('click', () => this.borrarUbicacion(loc.direccion));
          }
        }, 0);
      });
    });


    setTimeout(() => this.map!.invalidateSize(), 300);
  }

  agregarUbicacion(): void {
    if (!this.newDireccion.trim() || !this.newNombre.trim() || !this.map || !this.currentLibrary) return;

    const fullDireccion = `${this.newDireccion}, Perú`;

    this.geocodingService.getCoordinatesFromAddress(fullDireccion).subscribe({
      next: coords => {
        const nuevaUbicacion = {
          lat: coords.lat,
          lng: coords.lng,
          direccion: this.newNombre
        };

        // Agregar visual en el mapa
        const icon = L.icon({
          iconUrl: 'assets/RajeIcon.png',
          iconSize: [35, 35],
          iconAnchor: [17, 34],
          popupAnchor: [0, -30]
        });

        L.marker([coords.lat, coords.lng], { icon })
          .addTo(this.map!)
          .bindPopup(`<strong>${this.newNombre}</strong>`)
          .openPopup();

        // Actualizar en memoria

        // 🔥 Actualizar en json-server
        this.libraryService.addUbicacion(this.currentLibrary!.id, nuevaUbicacion).subscribe({
          next: updated => {
            this.currentLibrary = updated;
            localStorage.setItem('currentLibrary', JSON.stringify(updated));
            this.newDireccion = '';
            this.newNombre = '';
          },
          error: err => alert('No se pudo guardar en el servidor')
        });

      },
      error: err => alert(err.message)
    });
  }
  borrarUbicacion(direccion: string): void {
    if (!this.currentLibrary) return;

    const confirmDelete = confirm(`¿Deseas eliminar la ubicación "${direccion}"?`);
    if (!confirmDelete) return;

    this.libraryService.removeUbicacion(this.currentLibrary.id, direccion).subscribe({
      next: updated => {
        this.currentLibrary = updated;
        localStorage.setItem('currentLibrary', JSON.stringify(updated));
        window.location.reload(); // recargar mapa para que desaparezca el marcador
      },
      error: err => alert('No se pudo eliminar la ubicación.')
    });
  }


}
