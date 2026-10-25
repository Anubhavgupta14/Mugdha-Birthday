import { useEffect, useRef } from "react";
import gsap from "gsap";

// Gaia, the patient. health goes from 0 (feverish and inflamed) to 1 (thriving).

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function mix(c1: string, c2: string, t: number) {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [a, b] = [p(c1), p(c2)];
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;
}

const CONTINENTS = [
  "M18 62 C 30 40, 58 38, 66 52 C 74 64, 60 74, 64 88 C 68 104, 50 112, 44 100 C 38 88, 22 92, 18 80 Z",
  "M52 118 C 62 112, 74 120, 70 136 C 66 152, 58 166, 50 158 C 44 148, 46 128, 52 118 Z",
  "M96 50 C 110 40, 130 46, 128 58 C 140 56, 160 62, 156 76 C 150 88, 132 82, 126 92 C 120 104, 104 96, 100 84 C 94 74, 86 60, 96 50 Z",
  "M108 104 C 120 98, 134 108, 130 124 C 126 140, 112 148, 106 136 C 100 124, 98 110, 108 104 Z",
  "M150 120 C 160 114, 176 120, 172 132 C 168 142, 152 142, 148 134 C 146 128, 146 124, 150 120 Z",
];

export default function Earth({ health, className, face = true }: { health: number; className?: string; face?: boolean }) {
  const h = Math.max(0, Math.min(1, health));
  const lands = useRef<SVGGElement>(null);
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!lands.current) return;
    const t = gsap.fromTo(lands.current, { x: 0 }, { x: -200, duration: 40, ease: "none", repeat: -1 });
    return () => {
      t.kill();
    };
  }, []);

  useEffect(() => {
    if (!root.current) return;
    const sick = root.current.querySelectorAll(".sick-only");
    gsap.to(sick, { opacity: h < 0.55 ? 1 - h / 0.55 : 0, duration: 1.2 });
  }, [h]);

  const ocean = mix("#8a4a3a", "#2a8ee0", h);
  const oceanDeep = mix("#4a1f1a", "#0f4fa0", h);
  const land = mix("#9c6a33", "#3fc46f", h);
  const glow = mix("#ff4d2e", "#6cf0ff", h);
  const mouthY = lerp(-14, 16, h);
  const sweatOpacity = h < 0.3 ? 1 : 0;

  return (
    <svg ref={root} viewBox="-20 -20 240 240" className={className} role="img" aria-label={`Planet Earth, health ${Math.round(h * 100)}%`}>
      <defs>
        <radialGradient id="earthOcean" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor={ocean} />
          <stop offset="1" stopColor={oceanDeep} />
        </radialGradient>
        <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0.72" stopColor={glow} stopOpacity="0.55" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="earthShade" cx="30%" cy="25%" r="85%">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        <clipPath id="earthClip">
          <circle cx="100" cy="100" r="90" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="118" fill="url(#earthGlow)" />
      <circle cx="100" cy="100" r="90" fill="url(#earthOcean)" />
      <g clipPath="url(#earthClip)">
        <g ref={lands}>
          {[0, 200].map((dx) => (
            <g key={dx} transform={`translate(${dx} 0)`}>
              {CONTINENTS.map((d, i) => (
                <path key={i} d={d} fill={land} />
              ))}
            </g>
          ))}
        </g>
        {/* smog band */}
        <g className="sick-only" opacity="1">
          <ellipse cx="60" cy="40" rx="50" ry="10" fill="#5b4a44" opacity="0.5" />
          <ellipse cx="140" cy="160" rx="60" ry="12" fill="#5b4a44" opacity="0.45" />
        </g>
        <circle cx="100" cy="100" r="90" fill="url(#earthShade)" />
      </g>
      {/* polar caps when healthy */}
      <ellipse cx="100" cy="14" rx={lerp(10, 26, h)} ry="6" fill="#fff" opacity={lerp(0.2, 0.9, h)} />

      {face && (
        <g>
          {h < 0.45 ? (
            <>
              <path d="M66 96 q8 -6 16 0" stroke="#2a0f0a" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M118 96 q8 -6 16 0" stroke="#2a0f0a" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="74" cy="94" rx="7" ry={lerp(5, 9, h)} fill="#1b1030" />
              <ellipse cx="126" cy="94" rx="7" ry={lerp(5, 9, h)} fill="#1b1030" />
              <circle cx="76.5" cy="91" r="2.5" fill="#fff" />
              <circle cx="128.5" cy="91" r="2.5" fill="#fff" />
            </>
          )}
          <path d={`M78 128 Q100 ${128 + mouthY} 122 128`} stroke="#2a0f0a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <circle cx="62" cy="116" r="9" fill="#ff6b8a" opacity={lerp(0, 0.55, h)} />
          <circle cx="138" cy="116" r="9" fill="#ff6b8a" opacity={lerp(0, 0.55, h)} />
          {/* thermometer + sweat while feverish */}
          <g className="sick-only">
            <g transform="rotate(-25 128 128)">
              <rect x="118" y="124" width="46" height="8" rx="4" fill="#f1f5f9" stroke="#94a3b8" />
              <rect x="122" y="126.5" width="32" height="3" rx="1.5" fill="#ef4444" />
              <circle cx="162" cy="128" r="6" fill="#ef4444" />
            </g>
          </g>
          <path d="M150 70 q6 10 0 14 q-6 -4 0 -14 Z" fill="#9ee6ff" opacity={sweatOpacity} />
        </g>
      )}
    </svg>
  );
}
