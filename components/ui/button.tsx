import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-key text-white shadow-[0_8px_22px_-10px_var(--color-key)] hover:bg-key-deep active:translate-y-px",
        ghost:
          "text-fg/80 hover:text-fg hover:bg-bg-soft border border-transparent",
        outline:
          "border border-line bg-surface text-fg hover:border-key/50 hover:text-key",
        soft: "bg-bg-soft text-fg hover:bg-line-soft border border-line",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = {
  href?: string;
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof button> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(button({ variant, size }), className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
