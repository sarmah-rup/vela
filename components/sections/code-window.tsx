"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type CodeTab = {
  label: string;
  language: string;
  filename: string;
  code: string;
};

// Lightweight token highlighter. Not a real parser, just enough colour to
// make the mock feel alive across the languages we show. Dark-slab palette.
function highlight(code: string) {
  return code.split("\n").map((line, i) => {
    const parts: React.ReactNode[] = [];
    const pattern =
      /(\/\/[^\n]*|#[^\n]*)|("[^"]*"|'[^']*'|`[^`]*`)|\b(\d+\.?\d*)\b|\b(const|let|await|import|from|export|return|def|new|async|function|curl|true|false|null|None|True|False)\b|\b([A-Za-z_][A-Za-z0-9_]*)(?=\()/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(line))) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      const [full, comment, str, num, kw, fn] = m;
      if (comment)
        parts.push(
          <span key={m.index} className="text-slate-500 italic">
            {full}
          </span>,
        );
      else if (str)
        parts.push(
          <span key={m.index} className="text-[#9ece6a]">
            {full}
          </span>,
        );
      else if (num)
        parts.push(
          <span key={m.index} className="text-[#ff9e64]">
            {full}
          </span>,
        );
      else if (kw)
        parts.push(
          <span key={m.index} className="text-[#bb9af7]">
            {full}
          </span>,
        );
      else if (fn)
        parts.push(
          <span key={m.index} className="text-[#7aa2f7]">
            {full}
          </span>,
        );
      last = m.index + full.length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return (
      <div key={i} className="table-row leading-6">
        <span className="table-cell select-none pr-5 text-right text-[0.7rem] text-slate-600">
          {i + 1}
        </span>
        <span className="table-cell whitespace-pre-wrap">{parts}</span>
      </div>
    );
  });
}

export function CodeWindow({
  tabs,
  className,
  title = "imagepipeline.io",
}: {
  tabs: CodeTab[];
  className?: string;
  title?: string;
}) {
  const [active, setActive] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const tab = tabs[active];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tab.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard may be blocked in preview */
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border border-[#1c2030] bg-[#0d0f16] text-[#c8ccd6] shadow-[0_30px_70px_-40px_rgba(13,15,20,0.5)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-slate-400">{title}</span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-pill border border-white/15 px-2.5 py-1 font-mono text-[0.7rem] text-slate-400 transition-colors hover:text-white"
        >
          {copied ? (
            <Check className="h-3 w-3 text-[#9ece6a]" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex items-center gap-1 border-b border-white/10 px-2 py-1.5">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={cn(
              "relative rounded-lg px-3 py-1.5 font-mono text-xs transition-colors",
              i === active ? "text-white" : "text-slate-500 hover:text-slate-300",
            )}
          >
            {i === active ? (
              <motion.span
                layoutId={`codetab-${title}`}
                className="absolute inset-0 rounded-lg bg-white/[0.08]"
                transition={{ duration: 0.2 }}
              />
            ) : null}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="relative max-h-[26rem] overflow-auto p-4 font-mono text-[0.82rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="table w-full"
          >
            {highlight(tab.code)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
