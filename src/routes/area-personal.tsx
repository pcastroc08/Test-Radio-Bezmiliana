import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase, uploadMedia } from "@/lib/supabase";
import type { UserRole, AppUser } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import {
  Lock, LogOut, Plus, Trash2, Pencil, Users, Radio, Newspaper,
  X, Check, Eye, EyeOff, Upload, Image as ImageIcon, Music,
} from "lucide-react";
import { PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/area-personal")({
  head: () => ({
    meta: [{ title: "Área Personal — Radio Bezmiliana" }],
  }),
  component: AreaPersonalPage,
});

// ─── helpers ─────────────────────────────────────────────────────────────────

function RolBadge({ rol }: { rol: UserRole }) {
  const map: Record<UserRole, { label: string; color: string }> = {
    direccion: { label: "Dirección", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    locutor: { label: "Locutor/a", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    redaccion: { label: "Redacción", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    tecnico: { label: "Técnico", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    rrss: { label: "Redes sociales", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  };
  const { label, color } = map[rol] ?? { label: rol, color: "bg-white/10 text-foreground border-white/10" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${color}`}>
      {label}
    </span>
  );
}

// ─── login ───────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError("Credenciales incorrectas. Comprueba tu email y contraseña."); return; }
    if (data.session) onLogin(data.session);
  }

  return (
    <div className="mx-auto mt-16 max-w-sm px-6 pb-24">
      <div className="glass-strong rounded-3xl border border-white/10 p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/20 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight">Acceso al área personal</h2>
          <p className="text-center text-sm text-muted-foreground">Solo para miembros de Radio Bezmiliana</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contraseña</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── dashboard direccion ──────────────────────────────────────────────────────

function DireccionDashboard({ user }: { user: AppUser }) {
  const [tab, setTab] = useState<"programas" | "noticias" | "usuarios">("programas");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {(["programas", "noticias", "usuarios"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${tab === t ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}
          >
            {t === "programas" ? <><Radio className="mr-1.5 inline h-3.5 w-3.5" />Programas</> :
             t === "noticias" ? <><Newspaper className="mr-1.5 inline h-3.5 w-3.5" />Noticias</> :
             <><Users className="mr-1.5 inline h-3.5 w-3.5" />Usuarios</>}
          </button>
        ))}
      </div>
      {tab === "programas" && <ProgramasPanel />}
      {tab === "noticias" && <NoticiasPanel />}
      {tab === "usuarios" && <UsuariosPanel />}
    </div>
  );
}

// ─── FileUploadField ──────────────────────────────────────────────────────────

function FileUploadField({
  label,
  accept,
  icon: Icon,
  onUploaded,
  currentUrl,
}: {
  label: string;
  accept: string;
  icon: React.ElementType;
  onUploaded: (url: string) => void;
  currentUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    setFileName(file.name);
    try {
      const folder = accept.includes("audio") ? "audio" : "imagenes";
      const url = await uploadMedia(file, folder);
      onUploaded(url);
    } catch (err: any) {
      setError("Error al subir: " + (err?.message ?? "desconocido"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm transition hover:border-primary/40 hover:bg-primary/5"
      >
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-muted-foreground">
          {uploading ? "Subiendo..." : fileName || (currentUrl ? "Archivo actual (haz clic para cambiar)" : "Haz clic para seleccionar archivo")}
        </span>
        <Upload className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {currentUrl && !uploading && (
        <p className="mt-1 truncate text-xs text-green-400">✓ Archivo subido correctamente</p>
      )}
    </div>
  );
}

// ─── ProgramasPanel ───────────────────────────────────────────────────────────

type ProgramaForm = {
  open: boolean;
  id?: string;
  titulo: string;
  descripcion: string;
  slug: string;
  categoria: string;
  sinopsis: string;
  frecuencia: string;
  presentadores: string;
  imagen_url: string;
  audio_url: string;
  episodio_unico: boolean;
};

const FORM_VACIO: ProgramaForm = {
  open: false,
  titulo: "",
  descripcion: "",
  slug: "",
  categoria: "",
  sinopsis: "",
  frecuencia: "",
  presentadores: "",
  imagen_url: "",
  audio_url: "",
  episodio_unico: false,
};

function ProgramasPanel() {
  const [programas, setProgramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProgramaForm>(FORM_VACIO);

  useEffect(() => { fetchProgramas(); }, []);

  async function fetchProgramas() {
    setLoading(true);
    const { data } = await supabase.from("programas").select("*").order("created_at", { ascending: false });
    setProgramas(data ?? []);
    setLoading(false);
  }

  function slugify(text: string) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleTituloChange(v: string) {
    setForm(f => ({ ...f, titulo: v, slug: f.id ? f.slug : slugify(v) }));
  }

  async function handleSave() {
    if (!form.titulo || !form.slug) return;
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      slug: form.slug,
      categoria: form.categoria,
      sinopsis: form.sinopsis,
      fecha_emision: form.frecuencia,
      imagen_url: form.imagen_url || null,
      audio_url: form.audio_url || null,
      episodio_unico: form.episodio_unico,
    };
    if (form.id) {
      await supabase.from("programas").update(payload).eq("id", form.id);
    } else {
      await supabase.from("programas").insert(payload);
    }
    setForm(FORM_VACIO);
    fetchProgramas();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este programa?")) return;
    await supabase.from("programas").delete().eq("id", id);
    fetchProgramas();
  }

  return (
    <Panel title="Programas" onAdd={() => setForm({ ...FORM_VACIO, open: true })}>
      {form.open && (
        <FormModal
          title={form.id ? "Editar programa" : "Nuevo programa"}
          onClose={() => setForm(FORM_VACIO)}
          onSave={handleSave}
        >
          <Field label="Título" value={form.titulo} onChange={handleTituloChange} />
          <Field label="Slug (URL)" value={form.slug} onChange={(v) => setForm(f => ({ ...f, slug: v }))} placeholder="buenos-dias-bezmiliana" />
          <Field label="Categoría" value={form.categoria} onChange={(v) => setForm(f => ({ ...f, categoria: v }))} placeholder="Magazine, Música, Deportes…" />
          <Field label="Descripción corta" value={form.descripcion} onChange={(v) => setForm(f => ({ ...f, descripcion: v }))} textarea />
          <Field label="Sinopsis larga" value={form.sinopsis} onChange={(v) => setForm(f => ({ ...f, sinopsis: v }))} textarea />
          <Field label="Frecuencia / Horario" value={form.frecuencia} onChange={(v) => setForm(f => ({ ...f, frecuencia: v }))} placeholder="Lunes y miércoles · 08:15" />
          <Field label="Presentadores (separados por coma)" value={form.presentadores} onChange={(v) => setForm(f => ({ ...f, presentadores: v }))} placeholder="Ana García, Luis Pérez" />

          <FileUploadField
            label="Imagen de portada"
            accept="image/*"
            icon={ImageIcon}
            currentUrl={form.imagen_url}
            onUploaded={(url) => setForm(f => ({ ...f, imagen_url: url }))}
          />

          {/* Episodio único: solo mostrar campo audio si está marcado */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <input
              id="episodio-unico"
              type="checkbox"
              checked={form.episodio_unico}
              onChange={(e) => setForm(f => ({ ...f, episodio_unico: e.target.checked }))}
              className="h-4 w-4 rounded accent-primary"
            />
            <label htmlFor="episodio-unico" className="cursor-pointer text-sm">
              <span className="font-medium">Episodio único</span>
              <span className="ml-2 text-xs text-muted-foreground">(el programa tiene un solo audio, sin episodios separados)</span>
            </label>
          </div>

          {form.episodio_unico && (
            <FileUploadField
              label="Audio del programa"
              accept="audio/*"
              icon={Music}
              currentUrl={form.audio_url}
              onUploaded={(url) => setForm(f => ({ ...f, audio_url: url }))}
            />
          )}
        </FormModal>
      )}

      {loading ? <Spinner /> : programas.length === 0 ? <Empty text="No hay programas todavía" /> : (
        <ul className="space-y-3">
          {programas.map((p) => (
            <ItemRow
              key={p.id}
              title={p.titulo}
              subtitle={`/${p.slug}${p.episodio_unico ? " · episodio único" : ""}`}
              onEdit={() => setForm({
                open: true,
                id: p.id,
                titulo: p.titulo,
                descripcion: p.descripcion ?? "",
                slug: p.slug,
                categoria: p.categoria ?? "",
                sinopsis: p.sinopsis ?? "",
                frecuencia: p.fecha_emision ?? "",
                presentadores: "",
                imagen_url: p.imagen_url ?? "",
                audio_url: p.audio_url ?? "",
                episodio_unico: p.episodio_unico ?? false,
              })}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </ul>
      )}
    </Panel>
  );
}

// ─── NoticiasPanel ────────────────────────────────────────────────────────────

function NoticiasPanel() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ open: boolean; id?: string; titulo: string; texto: string }>({ open: false, titulo: "", texto: "" });

  useEffect(() => { fetchNoticias(); }, []);

  async function fetchNoticias() {
    setLoading(true);
    const { data } = await supabase.from("noticias").select("*").order("created_at", { ascending: false });
    setNoticias(data ?? []);
    setLoading(false);
  }

  async function handleSave() {
    if (!form.titulo) return;
    if (form.id) {
      await supabase.from("noticias").update({ titulo: form.titulo, texto: form.texto }).eq("id", form.id);
    } else {
      await supabase.from("noticias").insert({ titulo: form.titulo, texto: form.texto });
    }
    setForm({ open: false, titulo: "", texto: "" });
    fetchNoticias();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta noticia?")) return;
    await supabase.from("noticias").delete().eq("id", id);
    fetchNoticias();
  }

  return (
    <Panel title="Noticias" onAdd={() => setForm({ open: true, titulo: "", texto: "" })}>
      {form.open && (
        <FormModal title={form.id ? "Editar noticia" : "Nueva noticia"} onClose={() => setForm({ open: false, titulo: "", texto: "" })} onSave={handleSave}>
          <Field label="Título" value={form.titulo} onChange={(v) => setForm(f => ({ ...f, titulo: v }))} />
          <Field label="Texto" value={form.texto} onChange={(v) => setForm(f => ({ ...f, texto: v }))} textarea />
        </FormModal>
      )}
      {loading ? <Spinner /> : noticias.length === 0 ? <Empty text="No hay noticias todavía" /> : (
        <ul className="space-y-3">
          {noticias.map((n) => (
            <ItemRow key={n.id} title={n.titulo} subtitle={n.fecha} onEdit={() => setForm({ open: true, id: n.id, titulo: n.titulo, texto: n.texto ?? "" })} onDelete={() => handleDelete(n.id)} />
          ))}
        </ul>
      )}
    </Panel>
  );
}

// ─── UsuariosPanel ────────────────────────────────────────────────────────────

function UsuariosPanel() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ open: boolean; id?: string; nombre: string; email: string; rol: UserRole; password: string }>({ open: false, nombre: "", email: "", rol: "locutor", password: "" });

  useEffect(() => { fetchUsuarios(); }, []);

  async function fetchUsuarios() {
    setLoading(true);
    const { data } = await supabase.from("perfiles").select("*").order("nombre");
    setUsuarios(data ?? []);
    setLoading(false);
  }

  async function handleSave() {
    if (!form.nombre || !form.email) return;
    if (form.id) {
      await supabase.from("perfiles").update({ nombre: form.nombre, rol: form.rol }).eq("id", form.id);
    } else {
      await supabase.from("perfiles").insert({ nombre: form.nombre, email: form.email, rol: form.rol });
    }
    setForm({ open: false, nombre: "", email: "", rol: "locutor", password: "" });
    fetchUsuarios();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este usuario?")) return;
    await supabase.from("perfiles").delete().eq("id", id);
    fetchUsuarios();
  }

  const ROLES: UserRole[] = ["direccion", "locutor", "redaccion", "tecnico", "rrss"];

  return (
    <Panel title="Usuarios" onAdd={() => setForm({ open: true, nombre: "", email: "", rol: "locutor", password: "" })}>
      {form.open && (
        <FormModal title={form.id ? "Editar usuario" : "Nuevo usuario"} onClose={() => setForm({ open: false, nombre: "", email: "", rol: "locutor", password: "" })} onSave={handleSave}>
          <Field label="Nombre" value={form.nombre} onChange={(v) => setForm(f => ({ ...f, nombre: v }))} />
          {!form.id && <Field label="Email" value={form.email} onChange={(v) => setForm(f => ({ ...f, email: v }))} placeholder="usuario@email.com" />}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rol</label>
            <select value={form.rol} onChange={(e) => setForm(f => ({ ...f, rol: e.target.value as UserRole }))} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition focus:border-primary/50">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </FormModal>
      )}
      {loading ? <Spinner /> : usuarios.length === 0 ? <Empty text="No hay usuarios todavía" /> : (
        <ul className="space-y-3">
          {usuarios.map((u) => (
            <ItemRow key={u.id} title={u.nombre} subtitle={u.email} badge={<RolBadge rol={u.rol} />} onEdit={() => setForm({ open: true, id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, password: "" })} onDelete={() => handleDelete(u.id)} />
          ))}
        </ul>
      )}
    </Panel>
  );
}

// ─── otros dashboards ─────────────────────────────────────────────────────────

function LocutorDashboard() {
  return (
    <Panel title="Mis programas" hideAdd>
      <Empty text="No tienes programas asignados todavía" />
    </Panel>
  );
}

function RedaccionDashboard() {
  return (
    <Panel title="Guiones y notas" hideAdd>
      <Empty text="No hay guiones disponibles todavía" />
    </Panel>
  );
}

function TecnicoDashboard() {
  return (
    <Panel title="Archivos de producción" hideAdd>
      <Empty text="No hay archivos disponibles todavía" />
    </Panel>
  );
}

function RrsssDashboard() {
  return (
    <Panel title="Contenido para redes" hideAdd>
      <Empty text="No hay contenido disponible todavía" />
    </Panel>
  );
}

// ─── shared UI ────────────────────────────────────────────────────────────────

function Panel({ title, onAdd, hideAdd, children }: { title: string; onAdd?: () => void; hideAdd?: boolean; children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-3xl border border-white/10 p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold tracking-tight">{title}</h3>
        {!hideAdd && onAdd && (
          <button onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-glow transition hover:scale-105">
            <Plus className="h-3.5 w-3.5" /> Nuevo
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function FormModal({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>
      <div className="space-y-3">{children}</div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-white/5">Cancelar</button>
        <button onClick={onSave} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white">
          <Check className="h-3.5 w-3.5" /> Guardar
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, textarea }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) {
  const cls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30";
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className={cls} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

function ItemRow({ title, subtitle, badge, onEdit, onDelete }: { title: string; subtitle?: string; badge?: React.ReactNode; onEdit: () => void; onDelete: () => void }) {
  return (
    <li className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <div className="min-w-0">
        <div className="truncate font-medium">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        {badge && <div className="mt-1">{badge}</div>}
      </div>
      <div className="ml-3 flex shrink-0 gap-1">
        <button onClick={onEdit} className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-white/5 hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
        <button onClick={onDelete} className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </li>
  );
}

function Spinner() {
  return <div className="py-8 text-center text-sm text-muted-foreground">Cargando...</div>;
}

function Empty({ text }: { text: string }) {
  return <div className="py-8 text-center text-sm text-muted-foreground">{text}</div>;
}

// ─── main page ────────────────────────────────────────────────────────────────

function AreaPersonalPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess) loadProfile(sess.user.id);
      else setAppUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    setLoadingProfile(true);
    const { data } = await supabase.from("perfiles").select("*").eq("id", userId).single();
    if (data) setAppUser(data as AppUser);
    setLoadingProfile(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return (
      <>
        <PageHeader eyebrow="Área personal" title={<>Acceso <span className="text-gradient-brand">privado</span></>} description="Espacio exclusivo para los miembros de Radio Bezmiliana." />
        <LoginForm onLogin={(sess) => setSession(sess)} />
      </>
    );
  }

  if (loadingProfile || !appUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Área personal"
        title={<>Hola, <span className="text-gradient-brand">{appUser.nombre}</span></>}
        description=""
      />
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8 flex items-center justify-between">
          <RolBadge rol={appUser.rol} />
          <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground">
            <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
          </button>
        </div>

        {appUser.rol === "direccion" && <DireccionDashboard user={appUser} />}
        {appUser.rol === "locutor" && <LocutorDashboard />}
        {appUser.rol === "redaccion" && <RedaccionDashboard />}
        {appUser.rol === "tecnico" && <TecnicoDashboard />}
        {appUser.rol === "rrss" && <RrsssDashboard />}
      </div>
    </>
  );
}
