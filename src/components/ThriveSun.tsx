import { useId } from "react";

// Vector take on the iThrive sun: a centre disc ringed by nine petals,
// each petal a circle clipped by the outer ring.

const R = 98;
const PETAL_R = 0.3 * R;
const PETAL_D = 0.91 * R;
const PETALS = Array.from({ length: 9 }, (_, i) => {
  const a = ((-105 + i * 40) * Math.PI) / 180;
  return { cx: 100 + PETAL_D * Math.cos(a), cy: 100 + PETAL_D * Math.sin(a) };
});

export default function ThriveSun({
  className,
  color = "#f7b518",
  petalsClassName,
}: {
  className?: string;
  color?: string;
  petalsClassName?: string;
}) {
  const clip = `sun-clip-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <clipPath id={clip}>
          <circle cx="100" cy="100" r={R} />
        </clipPath>
      </defs>
      <g className={petalsClassName} style={{ transformOrigin: "100px 100px" }}>
        <g clipPath={`url(#${clip})`}>
          {PETALS.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={PETAL_R} fill={color} />
          ))}
        </g>
      </g>
      <circle cx="100" cy="100" r={0.54 * R} fill={color} />
    </svg>
  );
}
