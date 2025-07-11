export class Author {
  id: string;
  nombre: string;
  descripcion: string;
  fechaNacimiento: string;
  ciudad_origen: string;
  imagen: string;

  constructor(author: Partial<Author>) {
    this.id = author.id || '';
    this.nombre = author.nombre || '';
    this.descripcion = author.descripcion || '';
    this.fechaNacimiento = author.fechaNacimiento || '';
    this.ciudad_origen = author.ciudad_origen || '';
    this.imagen = author.imagen || '';
  }
}
