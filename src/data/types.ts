export interface Programa {
  slug: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  sinopsis: string;
  presentadores: string[];
  frecuencia: string;
  color: string;
  imagen: string;
  episodios: number;
}

export interface Episodio {
  id: string;
  programaSlug: string;
  titulo: string;
  fecha: string;
  duracion: string;
  descripcion: string;
  audioUrl: string;
}

export interface Noticia {
  slug: string;
  titulo: string;
  fecha: string;
  categoria: string;
  resumen: string;
  imagen: string;
  contenido: string;
}
