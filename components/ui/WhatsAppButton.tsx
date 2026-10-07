"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import type { CtaLocation, WhatsAppIntent } from "@/lib/types";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./Button";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface WhatsAppButtonProps {
  location: CtaLocation;
  intent?: WhatsAppIntent;
  flavor?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Accessible name when the visible label is ambiguous. */
  ariaLabel?: string;
  showIcon?: boolean;
  children: ReactNode;
}

/** The only component that renders WhatsApp links — keeps tracking consistent. */
export function WhatsAppButton({
  location,
  intent = "general",
  flavor,
  variant = "primary",
  size = "md",
  className,
  ariaLabel,
  showIcon = true,
  children,
}: WhatsAppButtonProps) {
  const href = generateWhatsAppLink({ intent, flavor });

  const handleClick = () => {
    track("whatsapp_click", { intent, location, flavor });
    if (intent === "order" || intent === "flavor") {
      track("order_intent", { location, flavor });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={ariaLabel ? `${ariaLabel} (abre o WhatsApp)` : undefined}
      className={buttonClasses(variant, size, className)}
    >
      {showIcon && <WhatsAppIcon className="size-5 shrink-0" />}
      {children}
    </a>
  );
}
