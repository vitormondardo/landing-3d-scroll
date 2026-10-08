import { navLinks } from "@/content/site";
import { BRAND_NAME, DELIVERY_REGION, INSTAGRAM_URL } from "@/lib/constants";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function Footer() {
  return (
    <footer className="bg-night-deep text-coconut">
      <div className="px-gutter mx-auto max-w-[1800px] py-16 md:py-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-h3 font-bold">{BRAND_NAME}</p>
            <p className="mt-4 max-w-sm text-coconut/70">Gelos Saborizados Premium — gelo para drinks.</p>
            {DELIVERY_REGION && <p className="mt-2 text-coconut/70">Entregamos em {DELIVERY_REGION}.</p>}
          </div>

          <div className="flex flex-col gap-8 md:items-end">
            <WhatsAppButton location="footer" variant="primary">
              Fale com a gente
            </WhatsAppButton>
            <nav aria-label="Rodapé">
              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-coconut/80">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-coconut">
                      {link.label}
                    </a>
                  </li>
                ))}
                {INSTAGRAM_URL && (
                  <li>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-coconut">
                      Instagram
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        <p className="mt-16 border-t border-coconut/15 pt-6 text-xs text-coconut/60">
          © {BRAND_NAME}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
