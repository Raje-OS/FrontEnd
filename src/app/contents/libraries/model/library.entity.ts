export class Library {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  email: string;
  password: string;
  catalog: string[] = [];
  ubicaciones: { lat: number; lng: number; direccion: string }[] = [];

  constructor(library: {
    id?: string;
    nombre?: string;
    descripcion?: string;
    imagen?: string;
    email?: string;
    password?: string;
    catalog?: string[];
    ubicaciones?: { lat: number; lng: number; direccion: string }[];
  }) {
    this.id = library.id || '';
    this.nombre = library.nombre || '';
    this.descripcion = library.descripcion || '';
    this.imagen = library.imagen || '';
    this.email = library.email || '';
    this.password = library.password || '';
    this.catalog = library.catalog || [];
    this.ubicaciones = library.ubicaciones || [];
  }
}
