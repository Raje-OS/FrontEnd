export class Serie {
  id: string;
  titulo: string;
  directorId: string;
  actoresId: string[];
  genero: string[];
  num_temporadas: number;
  num_episodios: number;
  fecha_lanzamiento: string;
  idioma_original: string;
  pais_origen: string;
  plataformasId: string[];
  calificacion: number = 0; // Default value for rating
  sinopsis: string;
  imagen: string;

  constructor(serie: Partial<Serie>) {
    this.id = serie.id || '';
    this.titulo = serie.titulo || '';
    this.directorId = serie.directorId || '';
    this.actoresId = serie.actoresId || [];
    this.genero = serie.genero || [];
    this.num_temporadas = serie.num_temporadas || 0;
    this.num_episodios = serie.num_episodios || 0;
    this.fecha_lanzamiento = serie.fecha_lanzamiento || '';
    this.idioma_original = serie.idioma_original || '';
    this.pais_origen = serie.pais_origen || '';
    this.plataformasId = serie.plataformasId || [];
    this.calificacion= serie.calificacion || 0;
    this.sinopsis = serie.sinopsis || '';
    this.imagen = serie.imagen || '';
  }
}
