export class Platform {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  email: string;
  password: string;


  constructor(platform: {
    id?: string,
    nombre?: string,
    descripcion?: string,
    imagen?: string,
    email?: string,
    password?: string,

  }) {
    this.id = platform.id || '';
    this.nombre = platform.nombre || '';
    this.descripcion = platform.descripcion || '';
    this.imagen = platform.imagen || '';
    this.email = platform.email || '';
    this.password = platform.password || '';

  }
}
