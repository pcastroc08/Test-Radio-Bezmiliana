import { useEffect, useState } from "react";
import { LOGO_URL } from "@/utils/images";
import { cn } from "@/lib/utils";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 700);
    const t2 = setTimeout(() => setVisible(false), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-500",
        fade && "pointer-events-none opacity-0",
      )}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse-glow" />
          <img src={LOGO_URL} alt="" className="relative h-24 w-24 rounded-2xl object-contain" />
        </div>
        <div className="flex h-6 items-end gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="block w-1.5 origin-bottom rounded-sm bg-primary animate-equalizer"
              style={{ animationDelay: `${i * 0.12}s`, height: "100%" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
