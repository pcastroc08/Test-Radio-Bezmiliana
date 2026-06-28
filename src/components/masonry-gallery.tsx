import { GALERIA_IMAGES } from "@/utils/images";
import galeria from "@/data/galeria.json";

export function MasonryGallery() {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
      {galeria.map((item, i) => (
        <figure
          key={item.id}
          className="group relative mb-4 overflow-hidden rounded-3xl border border-white/5 break-inside-avoid animate-fade-up"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <img
            src={GALERIA_IMAGES[item.imagen]}
            alt={item.alt}
            loading="lazy"
            className="block w-full transition-transform duration-700 group-hover:scale-105"
          />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-sm font-medium text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            {item.alt}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
