import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Mail, MapPin } from "lucide-react";
import { LOGO_URL } from "@/utils/images";
import { SOCIAL_LINKS } from "@/utils/contact";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-surface/30 backdrop-blur">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="" className="h-12 w-12 rounded-lg object-contain" width={48} height={48} />
            <div>
              <div className="font-display text-lg font-bold tracking-tight">Radio Bezmiliana</div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            La emisora escolar del IES Bezmiliana. Noticias, música, deportes y proyectos educativos en formato podcast.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="group grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-foreground transition hover:from-primary hover:to-primary hover:text-white hover:shadow-glow"
            >
              <Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
            </a>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="group grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-foreground transition hover:from-primary hover:to-primary hover:text-white hover:shadow-glow"
            >
              <Youtube className="h-5 w-5 transition-transform group-hover:scale-110" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Explora</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/programas" className="text-foreground/80 transition hover:text-primary">Programas</Link></li>
            <li><Link to="/noticias" className="text-foreground/80 transition hover:text-primary">Noticias</Link></li>
            <li><Link to="/equipo" className="text-foreground/80 transition hover:text-primary">Equipo</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Acceso</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/contacto" className="text-foreground/80 transition hover:text-primary">Contacto</Link></li>
            <li><Link to="/area-personal" className="text-foreground/80 transition hover:text-primary">Área personal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Encuéntranos</h4>
          <ul className="mt-4 space-y-3 text-sm text-foreground/80">
            <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> IES Bezmiliana · Rincón de la Victoria, Málaga</li>
            <li className="flex items-start gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> radiobezmiliana@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Radio Bezmiliana · IES Bezmiliana</span>
        </div>
      </div>
    </footer>
  );
}
