export class Book {
  id: string;
  titulo: string;
  autor_id: string;
  genero: string[];
  num_paginas: number;
  fecha_publicacion: string;
  idioma_original: string;
  pais_origen: string;
  editorial: string;
  isbn: string;
  calificacion: number;
  sinopsis: string;
  imagen: string;
  librerias_id: string[];  // ✅ Nuevo campo agregado

  constructor(book: Partial<Book>) {
    this.id = book.id || '';
    this.titulo = book.titulo || '';
    this.autor_id = book.autor_id || '';
    this.genero = book.genero || [];
    this.num_paginas = book.num_paginas || 0;
    this.fecha_publicacion = book.fecha_publicacion || '';
    this.idioma_original = book.idioma_original || '';
    this.pais_origen = book.pais_origen || '';
    this.editorial = book.editorial || '';
    this.isbn = book.isbn || '';
    this.calificacion = book.calificacion || 0;
    this.sinopsis = book.sinopsis || '';
    this.imagen = book.imagen || '';
    this.librerias_id = book.librerias_id || [];  // ✅ Inicialización
  }
}
