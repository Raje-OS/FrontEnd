export class Actor {
  id: string;
  nombre: string;
  descripcion: string;
  fechaNacimiento: string;
  ciudad_origen: string;
  imagen: string;

  constructor(actor: {
    id?: string,
    nombre?: string,
    descripcion?: string,
    fechaNacimiento?: string,
    ciudad_origen?: string,
    imagen?: string
  }) {
    this.id = actor.id || '';
    this.nombre = actor.nombre || '';
    this.descripcion = actor.descripcion || '';
    this.fechaNacimiento = actor.fechaNacimiento || '';
    this.ciudad_origen = actor.ciudad_origen || '';
    this.imagen = actor.imagen || '';
  }
}
