import * as React from "react";

/**
 * Splash d'entrée — une aiguille trace le contour du cœur "Silk".
 * Affiché une seule fois par session, durée ~2.6s, puis fade-out doux.
 */
export function SplashIntro() {
  const [mounted, setMounted] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [fading, setFading] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("qos.splash.seen") === "1") return;
    } catch {
      // ignore
    }
    setMounted(true);
    const fadeTimer = setTimeout(() => setFading(true), 2400);
    const endTimer = setTimeout(() => {
      setHidden(true);
      try {
        sessionStorage.setItem("qos.splash.seen", "1");
      } catch {
        // ignore
      }
    }, 3000);
    // Bloque le scroll pendant l'intro
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!mounted || hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-cream transition-opacity duration-700 ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="relative flex w-full max-w-md flex-col items-center px-6">
        <svg
          viewBox="0 0 400 260"
          className="h-auto w-full max-w-[360px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/*
            Tracé du cœur (aiguille + fil).
            stroke-dasharray + stroke-dashoffset animés pour l'effet "couture".
          */}
          <defs>
            <style>{`
              .heart-path {
                fill: none;
                stroke: hsl(0 0% 10%);
                stroke-width: 2.4;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-dasharray: 620;
                stroke-dashoffset: 620;
                animation: stitch 2.2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
              }
              .needle {
                transform-origin: 0 0;
                offset-path: path('M 200 90 C 165 55, 110 70, 130 130 C 145 175, 200 210, 200 220 C 200 210, 255 175, 270 130 C 290 70, 235 55, 200 90 Z');
                offset-rotate: auto 90deg;
                animation: travel 2.2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
              }
              .silk-text {
                opacity: 0;
                animation: silk-in 0.7s ease-out 1.7s forwards;
              }
              .heart-fly {
                opacity: 0;
                transform-origin: center;
                animation: heart-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }
              .heart-fly-1 { animation-delay: 1.9s; }
              .heart-fly-2 { animation-delay: 2.05s; }
              .heart-fly-3 { animation-delay: 2.2s; }
              @keyframes stitch {
                to { stroke-dashoffset: 0; }
              }
              @keyframes travel {
                from { offset-distance: 0%; opacity: 1; }
                90%  { opacity: 1; }
                to   { offset-distance: 100%; opacity: 0; }
              }
              @keyframes silk-in {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes heart-pop {
                0%   { opacity: 0; transform: scale(0.4); }
                60%  { opacity: 1; transform: scale(1.15); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </defs>

          {/* Cœur tracé par l'aiguille */}
          <path
            className="heart-path"
            d="M 200 90 C 165 55, 110 70, 130 130 C 145 175, 200 210, 200 220 C 200 210, 255 175, 270 130 C 290 70, 235 55, 200 90 Z"
          />

          {/* Aiguille qui suit le tracé */}
          <g className="needle">
            <line x1="-22" y1="0" x2="22" y2="0" stroke="hsl(0 0% 10%)" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="-22" cy="0" r="2.2" fill="none" stroke="hsl(0 0% 10%)" strokeWidth="1.2" />
          </g>

          {/* Petits cœurs rouges qui s'envolent */}
          <g fill="hsl(355 70% 48%)" stroke="hsl(355 70% 48%)" strokeWidth="0.6">
            <path className="heart-fly heart-fly-1" d="M 305 95 c -3 -4 -10 -4 -10 2 c 0 5 10 10 10 10 c 0 0 10 -5 10 -10 c 0 -6 -7 -6 -10 -2 z" />
            <path className="heart-fly heart-fly-2" d="M 330 75 c -2 -3 -7 -3 -7 1.4 c 0 3.5 7 7 7 7 c 0 0 7 -3.5 7 -7 c 0 -4.4 -5 -4.4 -7 -1.4 z" transform="scale(0.8) translate(80,18)" />
            <path className="heart-fly heart-fly-3" d="M 290 65 c -2 -3 -7 -3 -7 1.4 c 0 3.5 7 7 7 7 c 0 0 7 -3.5 7 -7 c 0 -4.4 -5 -4.4 -7 -1.4 z" />
          </g>

          {/* "Silk" en script sous le cœur */}
          <text
            className="silk-text"
            x="200"
            y="252"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="500"
            fontSize="36"
            fill="hsl(0 0% 10%)"
          >
            QalbOfSilk
          </text>
        </svg>
      </div>
    </div>
  );
}
