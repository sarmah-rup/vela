import { logoCloud } from "@/lib/site";

export function LogoCloud({ label = "Trusted by modern commerce teams" }: { label?: string }) {
  const row = [...logoCloud, ...logoCloud];
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-faint">
        {label}
      </p>
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="marquee flex w-max items-center gap-12">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap font-display text-2xl tracking-tight text-muted/55 transition-colors hover:text-fg"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
