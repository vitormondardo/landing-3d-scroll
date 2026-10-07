import { WHATSAPP_NUMBER } from "./constants";
import type { WhatsAppIntent } from "./types";

const MESSAGES: Record<WhatsAppIntent, (flavor?: string) => string> = {
  general: () => "Olá! Vim pelo site e gostaria de conhecer os gelos de coco.",
  order: () => "Olá! Gostaria de fazer um pedido de gelos de coco.",
  flavor: (flavor) =>
    flavor
      ? `Olá! Vim pelo site e gostaria de saber mais sobre o gelo de coco sabor ${flavor}.`
      : "Olá! Vim pelo site e gostaria de conhecer os sabores de gelo de coco.",
  event: () => "Olá! Gostaria de saber sobre gelos de coco para um evento.",
};

export interface WhatsAppLinkOptions {
  intent?: WhatsAppIntent;
  flavor?: string;
  /** Overrides the intent message entirely. */
  message?: string;
}

export const hasWhatsAppNumber = WHATSAPP_NUMBER.length > 0;

export function getWhatsAppMessage({ intent = "general", flavor, message }: WhatsAppLinkOptions = {}): string {
  return message ?? MESSAGES[intent](flavor);
}

/**
 * Single source of truth for wa.me links. Without a configured number it
 * returns the generic wa.me chooser so the CTA still works in development.
 */
export function generateWhatsAppLink(options: WhatsAppLinkOptions = {}): string {
  const text = encodeURIComponent(getWhatsAppMessage(options));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
