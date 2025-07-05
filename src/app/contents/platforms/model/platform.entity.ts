export class Platform {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  email: string;
  password: string;
  catalog: string[] = [];

  constructor(platform: {
    id?: string,
    nombre?: string,
    descripcion?: string,
    imagen?: string,
    email?: string,
    password?: string,
    catalog?: string[]
  }) {
    this.id = platform.id || '';
    this.nombre = platform.nombre || '';
    this.descripcion = platform.descripcion || '';
    this.imagen = platform.imagen || '';
    this.email = platform.email || '';
    this.password = platform.password || '';
    this.catalog = platform.catalog || [];
  }
}
