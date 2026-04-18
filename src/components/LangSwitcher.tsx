import { useI18n, type Lang } from "@/lib/i18n";
import { Globe } from "lucide-react";
import * as React from "react";

export function LangSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const langs: { code: Lang; label: string }[] = [
    { code: "fr", label: "FR" },
    { code: "nl", label: "NL" },
    { code: "en", label: "EN" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent"
        aria-label="Changer la langue"
      >
        <Globe className="h-3.5 w-3.5" />
        {lang.toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[100px] overflow-hidden rounded-md border border-border bg-popover shadow-lg">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-xs uppercase tracking-wider transition-colors hover:bg-accent hover:text-accent-foreground ${
                lang === l.code ? "bg-muted font-semibold" : ""
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
