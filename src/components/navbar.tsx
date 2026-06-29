import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Lock, Menu, Moon, Sun, X } from "lucide-react";
import { LOGO_URL } from "@/utils/images";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/programas", label: "Programas" },
  { to: "/noticias", label: "Noticias" },
  { to: "/equipo", label: "Equipo" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "py-2" : "py-3 sm:py-4",
      )}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <nav
          className={cn(
            "glass-strong flex items-center justify-between rounded-2xl border border-white/10 px-3 py-2 sm:px-5 sm:py-3 transition-shadow",
            scrolled && "shadow-card",
          )}
        >
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Inicio Radio Bezmiliana">
            <img
              src={LOGO_URL}
              alt="Radio Bezmiliana"
              className="h-10 w-10 shrink-0 rounded-lg object-contain transition-transform group-hover:scale-105 sm:h-11 sm:w-11"
              width={44}
              height={44}
            />
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-base font-bold tracking-tight text-foreground">
                Radio Bezmiliana
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-foreground bg-white/5" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Área personal oculta intencionalmente */}
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
              className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-white/5 hover:text-foreground"
            >
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-white/5 hover:text-foreground lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            "glass-strong mt-2 overflow-hidden rounded-2xl border border-white/10 transition-all lg:hidden",
            open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0",
          )}
        >
          <div className="grid gap-1 p-3">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-primary/15 text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground hover:bg-white/5 hover:text-foreground" }}
                className="rounded-xl px-4 py-2.5 text-sm font-medium transition"
              >
                {l.label}
              </Link>
            ))}
            {/* Área personal oculta intencionalmente */}
          </div>
        </div>
      </div>
    </header>
  );
}
