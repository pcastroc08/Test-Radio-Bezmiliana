
# Radio Bezmiliana — Plan de construcción

## Stack y despliegue
- TanStack Start (React 19 + Vite 7 + TS) + Tailwind v4, ya configurado en el proyecto.
- Sin backend. Todos los datos en `src/data/*.json` importados directamente.
- Logo subido se sube a CDN con `lovable-assets` y se reutiliza en navbar, footer, loader y favicon (versión PNG/ICO derivada).
- Publicación con un clic desde Lovable. Exportable a GitHub. (Nota: el runtime es Workers/edge, no Vercel puro; funciona idéntico en navegador.)

## Identidad visual
- Modo oscuro por defecto, toggle a claro (persistido en `localStorage`, sin parpadeo gracias a `ScriptOnce`).
- Paleta: `#07111F` base, `#0F172A` superficie, `#EF4444` acento, `#FFFFFF`, `#E2E8F0`. Tokens en `src/styles.css` (`@theme inline` + variables `:root` / `.dark`).
- Tipografía: **Outfit** (titulares) + **Inter** (texto), vía `@fontsource` instalados con bun.
- Glassmorphism (cards con `backdrop-blur`, borde sutil blanco/10), sombras suaves rojas para acentos, bordes `rounded-2xl/3xl`.
- Animaciones: fade/scale on scroll (IntersectionObserver hook), hover lift, ecualizador animado en hero, transiciones de página con `view-transition`/framer-like CSS.

## Rutas (TanStack file-based en `src/routes/`)
```
__root.tsx            shell, navbar, footer, theme provider, player global, JSON-LD Organization
index.tsx             Home (hero + destacados)
programas.tsx         Listado + buscador
programas.$slug.tsx   Detalle programa + episodios + buscador episodios
noticias.tsx          Tarjetas de noticias
equipo.tsx            Profesores / alumnos / técnico
galeria.tsx           Masonry
documentos.tsx        Tarjetas PDF
contacto.tsx          Formulario (action a Formspree, endpoint configurable)
sitemap[.]xml.ts      Sitemap dinámico
$.tsx                 404 personalizada
```
Cada ruta con `head()` propio (title, description, og:*, canonical relativo).

## Componentes (`src/components/`)
- `Navbar` (glass sticky, menú hamburguesa móvil con sheet, toggle tema, logo).
- `Footer` profesional (logo, navegación, IG/YouTube grandes, créditos IES Bezmiliana).
- `Hero`, `ProgramCard`, `EpisodeCard`, `NewsCard`, `TeamCard`, `MasonryGallery`, `DocumentCard`, `ContactForm`.
- `AudioPlayer` (player flotante inferior, controles play/pause/seek/volumen, Context global, gestiona episodio actual).
- `SearchInput` reutilizable (programas y episodios).
- `BackToTop`, `SkeletonCard`, `SectionReveal` (wrapper con animación scroll), `PageTransition`, `SplashScreen` (loader con logo + ecualizador, se desmonta tras hidratar).
- `ThemeProvider` + `useTheme` hook.

## Datos JSON (`src/data/`)
- `programas.json` — 3 programas (Buenos Días Bezmiliana, Música y Más, Deportes Bezmiliana) con `slug`, imagen, descripción, categoría, presentadores, frecuencia.
- `episodios.json` — episodios por `programaSlug` con título, fecha, duración, descripción, `audioUrl` (MP3 demo de dominio público, p. ej. SoundHelix), imagen.
- `noticias.json` — 3 noticias de ejemplo con imagen, fecha, resumen, contenido.
- `equipo.json` — profesores, alumnos, equipo técnico.
- `galeria.json` — entradas con URL, alt, ratio (imágenes generadas).
- `documentos.json` — título, descripción, URL PDF (PDFs demo).

## Imágenes
- Logo oficial subido a CDN como asset.
- `imagegen` para portadas de programas, noticias, galería (estudio de radio, micrófonos, entrevistas, podcasts) y hero. Estilo cinematográfico, paleta de marca.

## Extras solicitados
- Buscador de programas en `/programas` y de episodios dentro de cada programa.
- 404 personalizada con micrófono ilustrado y enlace al inicio.
- Scroll animations con IntersectionObserver.
- Skeleton loaders en grids (mostrados brevemente al hidratar).
- SEO: meta por ruta, Open Graph con la portada relevante, JSON-LD `RadioStation` y `PodcastSeries` por programa.
- `public/robots.txt` + `src/routes/sitemap[.]xml.ts` dinámico (incluye rutas estáticas + un slug por programa).
- **PWA manifest-only** (instalable / icono en escritorio) — `public/manifest.webmanifest` + iconos + meta theme-color. Sin service worker (cumple la guía: el usuario no pidió offline, solo PWA).
- Lazy loading con `loading="lazy"` en imágenes y `React.lazy` para Masonry/Galería pesada.
- Botón "volver arriba" flotante.
- Menú hamburguesa móvil (Sheet de shadcn).
- Formulario de contacto preparado para Formspree (constante `FORMSPREE_ENDPOINT` en `src/utils/contact.ts`, fácil de rellenar).

## Detalles técnicos
- Audio: `<audio>` HTMLMediaElement controlado por React Context, persistencia de episodio actual; player global montado en `__root.tsx`.
- Tema: clase `dark` en `<html>`, script inline en `__root` para evitar FOUC.
- Sin `useEffect+fetch` para datos: import directo de JSON.
- Todas las imágenes vía Lovable Assets (no se hinchan los bundles ni el repo).

## Lo que NO se incluye
- Service worker / offline (no solicitado explícitamente).
- Backend, base de datos, autenticación.
- Envío real del formulario (queda preparado para Formspree, requiere endpoint del usuario).

¿Procedo con esta construcción?
