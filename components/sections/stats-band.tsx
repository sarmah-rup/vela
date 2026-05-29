import { stats } from "@/lib/site";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";

export function StatsBand() {
  return (
    <Container>
      <Reveal>
        <div className="card grid grid-cols-2 divide-x divide-y divide-line overflow-hidden sm:grid-cols-4 sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5 p-6 sm:p-8">
              <CountUp
                value={s.value}
                className="font-display text-4xl font-bold tracking-tight text-key sm:text-5xl"
              />
              <span className="text-sm font-medium text-fg">{s.label}</span>
              <span className="text-xs text-faint">{s.sub}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}
