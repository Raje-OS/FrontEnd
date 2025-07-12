export class Movie {
  id: string;
  titulo: string;
  directorId: string;
  actoresId: string[];
  genero: string[];
  duracion: number;
  fecha_lanzamiento: string;
  idioma_original: string;
  pais_origen: string;
  plataformasId: string[];
  calificacion: number = 0; // Default value for rating
  sinopsis: string;
  imagen: string;

  constructor(movie: {
    id?: string,
    titulo?: string,
    director_id?: string,
    actores_id?: string[],
    genero?: string[],
    duracion?: number,
    fecha_lanzamiento?: string,
    idioma_original?: string,
    pais_origen?: string,
    plataformasId?: string[],
    calificacion?: number,
    sinopsis?: string,
    imagen?: string
  }) {
    this.id = movie.id || '';
    this.titulo = movie.titulo || '';
    this.directorId = movie.director_id || '';
    this.actoresId = movie.actores_id || [];
    this.genero = movie.genero || [];
    this.duracion = movie.duracion && Number.isInteger(movie.duracion) ? movie.duracion : 0;
    this.fecha_lanzamiento = movie.fecha_lanzamiento || '';
    this.idioma_original = movie.idioma_original || '';
    this.pais_origen = movie.pais_origen || '';
    this.plataformasId = movie.plataformasId || [];
    this.calificacion=movie.calificacion || 0;
    this.sinopsis = movie.sinopsis || '';
    this.imagen = movie.imagen || '';
  }
}

