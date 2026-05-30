"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "span";
  /**
   * For above-the-fold content. Keeps opacity at 1 (so the content is painted at
   * SSR, better FCP, and visible to render-based crawlers / no-JS) and only
   * animates a subtle slide on mount instead of fading in on scroll.
   */
  immediate?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
  immediate = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];

  if (immediate) {
    // Above-the-fold: render fully visible and static, no opacity gating and no
    // transform, so there's no entrance movement / layout shift.
    return <Comp className={cn(className)} initial={false}>{children}</Comp>;
  }

  return (
    <Comp
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Comp>
  );
}

/** Staggers direct children into view. Wrap items in <RevealItem>. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
