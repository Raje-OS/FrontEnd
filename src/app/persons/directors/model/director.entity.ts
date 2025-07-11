export class Director {
  id: string;
  nombre: string;
  descripcion: string;
  fehcaNacimiento: string;
  ciudad_origen: string;
  imagen: string;

  constructor(director: {
    id?: string,
    nombre?: string,
    descripcion?: string,
    fechaNacimiento?: string,
    ciudad_origen?: string,
    imagen?: string
  }) {
    this.id = director.id || '';
    this.nombre = director.nombre || '';
    this.descripcion = director.descripcion || '';
    this.fehcaNacimiento = director.fechaNacimiento || '';
    this.ciudad_origen = director.ciudad_origen || '';
    this.imagen = director.imagen || '';
  }
}
