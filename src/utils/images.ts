import logo from "../assets/logo.png";
import hero from "../assets/hero.jpg";
import buenosDias from "../assets/programa-buenos-dias.jpg";
import musica from "../assets/programa-musica.jpg";
import deportes from "../assets/programa-deportes.jpg";
import noticiaEstudio from "../assets/noticia-estudio.jpg";
import noticiaConcurso from "../assets/noticia-concurso.jpg";
import noticiaEntrevista from "../assets/noticia-entrevista.jpg";
import g1 from "../assets/galeria-1.jpg";
import g2 from "../assets/galeria-2.jpg";
import g3 from "../assets/galeria-3.jpg";
import g4 from "../assets/galeria-4.jpg";
import g5 from "../assets/galeria-5.jpg";
import g6 from "../assets/galeria-6.jpg";

export const LOGO_URL = logo;
export const HERO_IMAGE = hero;

export const PROGRAMA_IMAGES: Record<string, string> = {
  "buenos-dias": buenosDias,
  musica,
  deportes,
};

export const NOTICIA_IMAGES: Record<string, string> = {
  estudio: noticiaEstudio,
  concurso: noticiaConcurso,
  entrevista: noticiaEntrevista,
};

export const GALERIA_IMAGES: Record<string, string> = {
  g1, g2, g3, g4, g5, g6,
};
