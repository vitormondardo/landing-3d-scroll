import type { AnchorHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "dark" | "ghost" | "light";
export type ButtonSize = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full font-label font-semibold tracking-tight " +
  "transition-[background-color,color,transform,border-color] duration-300 ease-(--ease-out-expo) " +
  "active:scale-[0.98] focus-visible:outline-offset-4 select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-lime text-forest hover:bg-lime-hover",
  dark: "bg-forest text-coconut hover:bg-forest-2",
  ghost: "border border-current/30 text-current hover:border-current",
  light: "bg-coconut text-forest hover:bg-white",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base md:h-16 md:px-9 md:text-lg",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className = ""): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

/** Link styled as a button. All CTAs on this site are navigations. */
export function ButtonLink({ variant, size, className, children, ...props }: ButtonLinkProps) {
  return (
    <a className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </a>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`size-4 transition-transform duration-300 group-hover:translate-x-0.5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}
