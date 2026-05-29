"use client";

import * as React from "react";

// Animates the numeric part of a stat into view, e.g. "−88%", "60k+", "<900ms",
// "4.2B". Parses an optional prefix and suffix, counts the number up once on
// view, and respects reduced-motion.
function parse(value: string) {
  const m = value.match(/^([^\d.]*)([\d.,]+)(.*)$/);
  if (!m) return { prefix: "", num: null as number | null, suffix: value, decimals: 0 };
  const [, prefix, digits, suffix] = m;
  const clean = digits.replace(/,/g, "");
  const decimals = clean.includes(".") ? clean.split(".")[1].length : 0;
  return { prefix, num: parseFloat(clean), suffix, decimals };
}

export function CountUp({
  value,
  className,
  duration = 1300,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const { prefix, num, suffix, decimals } = React.useMemo(
    () => parse(value),
    [value],
  );
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(num === null ? value : `${prefix}0${suffix}`);

  React.useEffect(() => {
    if (num === null) return;
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finalText = `${prefix}${num.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

    let raf = 0;
    let start = 0;
    let done = false;

    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = num * eased;
      setDisplay(
        `${prefix}${current.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`,
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done) {
          done = true;
          if (reduce) setDisplay(finalText);
          else raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [num, prefix, suffix, decimals, duration, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
