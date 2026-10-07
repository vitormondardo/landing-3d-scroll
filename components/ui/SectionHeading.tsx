import type { ReactNode } from "react";

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  className?: string;
}

export function SectionHeading({ id, eyebrow, title, lead, className = "" }: SectionHeadingProps) {
  return (
    <header className={`max-w-4xl ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-5 font-display text-h2 font-bold text-balance">
        {title}
      </h2>
      {lead && <p className="mt-6 max-w-xl text-lead text-current/75 text-pretty">{lead}</p>}
    </header>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-label text-eyebrow font-semibold uppercase ${className}`}>{children}</p>;
}

/** Visible marker for content that still needs confirmation from the company. */
export function PlaceholderTag({ children = "a confirmar" }: { children?: ReactNode }) {
  return (
    <span className="font-label inline-flex items-center rounded-full border border-dashed border-current/50 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em]">
      {children}
    </span>
  );
}
