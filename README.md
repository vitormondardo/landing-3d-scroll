# Coco Ice — landing page

Landing page de produto com narrativa por scroll: a embalagem 3D do gelo é a protagonista e a conversão é o WhatsApp.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber + drei · GSAP + ScrollTrigger · Lenis

```bash
cp .env.example .env.local   # preencha marca, WhatsApp, domínio
npm install
npm run dev
```

`npm run lint` · `npm run typecheck` · `npm run build`

## Identidade ("Night Tropical")

Paleta e fontes ficam em `app/globals.css` (`@theme`) e `app/layout.tsx`.

| Token | Hex | Uso |
|---|---|---|
| `coconut` | `#F8F5EC` | fundo claro |
| `forest` / `forest-2` | `#123C35` / `#17665C` | identidade, texto, seção Benefícios |
| `lime` | `#C8F169` | CTAs e a seção final |
| `aqua` | `#66E0D0` | destaques sobre fundo escuro, luz 3D |
| `ice` | `#D9F7F4` | seção "Como usar" |
| `night` | `#101414` | seção 3D, ocasiões, rodapé |

Fontes: **Sora** (títulos), **Inter** (texto), **Manrope** (labels). O ritmo da página alterna
Coconut → Night (3D) → Forest → Coconut → Ice → Night → Lime → Night.

## Onde editar

| O quê | Arquivo |
|---|---|
| Marca, WhatsApp, domínio, região, flags | `.env.local` / `lib/constants.ts` |
| Sabores e arte da embalagem | `content/flavors.ts` (ver `docs/PACK_TEXTURE.md`) |
| Textos (hero, capítulos do produto, benefícios, passos, ocasiões, CTA) | `content/product.ts` |
| Mensagens do WhatsApp por intenção | `lib/whatsapp.ts` |
| Movimento e orçamento do 3D (gotas, gelos, DPR) | `lib/constants.ts` (`MOTION`, `SCENE`) |
| Coreografia por capítulo (posição, rotação, luz, fundo) | `components/product/productKeyframes.ts` |

O que ainda falta da empresa está em [`docs/CONTENT_TODO.md`](docs/CONTENT_TODO.md).

## Arquitetura do 3D (`components/product/`)

- `ProductExperience`: palco `sticky` com os capítulos rolando por cima, em fluxo normal (funciona sem JS e sem WebGL).
- `useProductScrollTimeline`: ScrollTriggers escrevem a posição do scroll (`ScrollState`: `enter` e `P`, a posição fracionária do capítulo). Nada de React state no scroll.
- `scene/SceneRig`: a cada frame suaviza `P`, amostra `productKeyframes` (cada capítulo "segura" a pose e anima entre eles) e grava um `SceneFrame`; também enquadra a câmera e controla fundo e exposição.
- `scene/*`: `Pack` (embalagem "pillow" com a arte como textura, condensação e gotas), `IceCubes`, `Coconuts`, `Mist`, `ContactShadow`, `Lighting` e `environment` (reflexos de estúdio gerados em código, sem baixar HDR). Cada um só lê o `SceneFrame` no seu `useFrame`.
- `ProductScene` é um chunk separado (`next/dynamic`, `ssr: false`), carregado só quando a seção se aproxima. Antes disso, e sem WebGL ou com reduced motion, aparece `ProductPoster` (a própria arte da embalagem).
- Celular: menos gotas, gelos e partículas, sem passes de transmissão e DPR menor. O `PerformanceMonitor` reduz o DPR e para o deslize das gotas se o FPS cair.

## Outros pontos

- `components/ui/WhatsAppButton` é o único lugar que gera links do WhatsApp e dispara `whatsapp_click` / `order_intent`.
- `lib/analytics.ts`: `track()` tipado, envia para `window.dataLayer` (GTM/GA4) e para um `CustomEvent`. Ainda sem fornecedor.
- `content/` é separado dos componentes, então trocar por um CMS depois não exige mexer na UI.
- `prefers-reduced-motion`: sem Lenis, sem animação de scroll, 3D substituído pela arte estática.
- O 3D é decorativo (`aria-hidden`); toda informação está em HTML.
