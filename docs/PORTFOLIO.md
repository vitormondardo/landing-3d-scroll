# Case técnico: landing page de produto com 3D guiado por scroll

> Documento para recrutadores e avaliadores técnicos. Nomes de empresa, marca e produto
> foram generalizados: aqui a empresa é a **"Marca X"** e o produto é um **"produto de
> consumo embalado"**. O código-fonte usa os nomes reais, que não aparecem neste documento.

## 1. Resumo

Landing page de conversão para uma marca de bens de consumo. O produto (a embalagem) é
renderizado em **3D no navegador** e reage à rolagem da página: cada seção "conta" uma parte
da história enquanto a câmera, a luz e a pose do objeto mudam. O objetivo de negócio é levar
o visitante a um **pedido via WhatsApp**, que é o único canal de conversão.

| | |
|---|---|
| Tipo | Site estático/híbrido, página única, mobile-first |
| Meta de negócio | Conversão em contato no WhatsApp, com eventos de analytics |
| Meta técnica | Experiência 3D fluida sem sacrificar SEO, acessibilidade nem desempenho |
| Escopo | Do design system ao deploy, desenvolvido de ponta a ponta por uma pessoa |

## 2. Stack e justificativas

| Camada | Tecnologia | Por quê |
|---|---|---|
| Framework | **Next.js 16** (App Router), **React 19** | SSR/SSG, metadados nativos, otimização de fontes e imagens, Cache Components |
| Linguagem | **TypeScript** (`strict`) | Segurança de tipos nas fronteiras: conteúdo, analytics, estado da cena |
| Estilo | **Tailwind CSS v4** via Turbopack, tokens em `@theme` | Design tokens centralizados (paleta, fontes), sem CSS morto |
| 3D | **three.js** + **React Three Fiber** + **drei** | Cena declarativa em React, com o ecossistema do three |
| Animação | **GSAP** + **ScrollTrigger** + `@gsap/react` | Timeline de scroll precisa, com controle de scrub e pin |
| Scroll | **Lenis** | Rolagem suave, integrada ao ticker do GSAP |
| Qualidade | **ESLint 9** (`eslint-config-next`), `tsc --noEmit` | Lint e checagem de tipos como portões de qualidade |
| Tooling | Scripts Node + **sharp** | Geração de assets (logo com transparência, textura da embalagem) |
| Hospedagem | Plataforma serverless compatível com Next.js (ver §8) | Deploy por Git, previews por branch, CDN global |

## 3. Visão geral da arquitetura

```
                ┌──────────────────────────────────────────────┐
  Conteúdo      │ content/*.ts  (textos, sabores, SEO)         │
  (dados)       │ lib/constants.ts + variáveis NEXT_PUBLIC_*   │
                └───────────────┬──────────────────────────────┘
                                │ importado por
                ┌───────────────▼──────────────────────────────┐
  Apresentação  │ app/ (rotas, layout, metadados, OG, sitemap) │
  (UI)          │ components/  seções + ui + layout            │
                │ hooks/       mídia, viewport, WebGL, Lenis   │
                └───────┬──────────────────────┬───────────────┘
                        │                      │
          ┌─────────────▼───────────┐  ┌───────▼────────────────┐
          │ Experiência 3D          │  │ Conversão e métricas   │
          │ components/product/     │  │ WhatsAppButton (único  │
          │ ScrollTrigger → estado  │  │ gerador de links)      │
          │ SceneRig → SceneFrame   │  │ lib/analytics.ts       │
          │ scene/* (leem o frame)  │  │ (dataLayer + DOM event)│
          └─────────────────────────┘  └────────────────────────┘
```

### Estrutura de pastas

```
app/          Rotas, layout raiz, metadados, robots, sitemap, imagem Open Graph dinâmica
components/   Seções da página (hero, benefícios, sabores...), UI base, layout e a cena 3D
content/      Textos e dados tipados, separados da UI
hooks/        useInView, useLenis, useMediaQuery, useReducedMotion, useWebGLSupport
lib/          Constantes/config, tipos, helpers de matemática, GSAP, WhatsApp, analytics
scripts/      Pipeline de assets (logo transparente, textura da embalagem)
docs/         Documentação operacional e este case
```

## 4. Decisões de engenharia

### 4.1 Cena 3D sem estado do React no scroll
O erro clássico é atualizar `useState` a cada pixel rolado, o que re-renderiza a árvore
inteira. Aqui o fluxo é unidirecional e fora do ciclo de render:

1. **ScrollTrigger** escreve a posição de scroll em um objeto mutável (`ScrollState`).
2. **`SceneRig`**, a cada frame (`useFrame`), suaviza essa posição (damping), amostra
   **keyframes** declarativos (`productKeyframes.ts`) e grava um `SceneFrame`.
3. Cada objeto da cena (embalagem, gelos, névoa, luz, sombra) só **lê** o `SceneFrame`.

Resultado: coreografia editável como dados (posição, rotação, luz, fundo por capítulo) e
zero re-render de React durante a rolagem.

### 4.2 Performance
- **Code splitting:** a cena é um chunk separado (`next/dynamic`, `ssr: false`), carregada
  só quando a seção está a ~1 viewport de distância (`IntersectionObserver`).
- **Orçamento por dispositivo:** celular recebe menos partículas, menos objetos, DPR menor
  e sem passes de transmissão (`SCENE` em `lib/constants.ts`).
- **Degradação adaptativa:** `PerformanceMonitor` reduz o DPR e desliga animações caras
  quando o FPS cai.
- **Sem downloads pesados:** reflexos de estúdio (environment) são gerados em código, sem HDR.
- **Fontes** via `next/font` (self-hosted, `display: swap`, subconjuntos e pesos mínimos).

### 4.3 Progressive enhancement e acessibilidade
- Todo o conteúdo existe em **HTML**; o 3D é decorativo (`aria-hidden`).
- Sem WebGL, ou com `prefers-reduced-motion`, a cena é trocada por um **pôster estático**
  (`ProductPoster`), e Lenis e animações de scroll são desligados.
- *Skip link* para o conteúdo, `lang="pt-BR"`, foco visível, alvos de toque adequados.
- Detecção de WebGL com `useSyncExternalStore`, sem *hydration mismatch* (`null` no servidor).

### 4.4 Conteúdo desacoplado da UI
Textos, sabores e SEO ficam em `content/` (dados tipados). Trocar por um CMS depois não
exige mexer nos componentes. Valores específicos da empresa (WhatsApp, domínio, região)
vêm de variáveis `NEXT_PUBLIC_*` e de `lib/constants.ts`; nada fica fixo nos componentes.
Campos ainda não confirmados pelo cliente são `null` e simplesmente **não renderizam**.

### 4.5 Analytics agnóstico de fornecedor
`track()` é tipado por um mapa de eventos (`AnalyticsEvents`), faz *push* em
`window.dataLayer` (GTM/GA4) e dispara um `CustomEvent`. Trocar ou somar fornecedores
(Pixel, CRM, Vercel Analytics) não altera nenhum ponto de chamada. Eventos: `page_view`,
`scroll_depth` (25/50/75/100), `product_view`, `flavor_view`, `whatsapp_click`, `order_intent`.

### 4.6 SEO técnico
Metadata API (título com template, canonical, Open Graph, Twitter Card), `robots.ts`,
`sitemap.ts`, **imagem OG gerada dinamicamente** (`opengraph-image.tsx`), ícones e
**JSON-LD** (`schema.org/Organization`).

### 4.7 Pipeline de assets
Scripts Node com `sharp` (`npm run build:logo`, `npm run extract:pack`) transformam as
artes recebidas do cliente (JPG com fundo "xadrez" embutido) em PNG/WebP com transparência
real, favicons e textura da embalagem. O processo é reprodutível e documentado.

## 5. Princípios aplicados

| Princípio | Onde aparece |
|---|---|
| **Separação de responsabilidades** | `content/` (dados) × `components/` (UI) × `lib/` (regras) × `hooks/` |
| **Single source of truth** | Config em `lib/constants.ts`; geração de links WhatsApp só em `WhatsAppButton` |
| **Fluxo de dados unidirecional** | Scroll → estado → frame → cena (somente leitura) |
| **Progressive enhancement** | HTML primeiro; 3D e animação como camada opcional |
| **Performance por orçamento** | Limites explícitos por dispositivo, medição em runtime |
| **Tipagem forte nas fronteiras** | `strict`, eventos de analytics tipados, conteúdo tipado |
| **Acessibilidade (WCAG)** | Skip link, reduced motion, conteúdo semântico, 3D `aria-hidden` |
| **Composição sobre herança** | Componentes pequenos e cena dividida em módulos independentes |
| **Open/Closed** | Novo capítulo ou sabor = novo dado, sem alterar a lógica |
| **12-factor (config)** | Configuração por ambiente via variáveis, `.env.example` versionado |

## 6. Qualidade e verificação

- `npm run typecheck` (TypeScript estrito) e `npm run lint` (ESLint 9 + regras do Next).
- `npm run build` valida rotas, tipos e geração estática.
- Verificação manual de desempenho em dispositivo móvel e com `reduced-motion`/sem WebGL.
- **Pontos de evolução honestos:** ainda não há testes automatizados (candidatos: Vitest para
  `lib/` e os keyframes, Playwright para o fluxo de conversão e smoke test do fallback sem
  WebGL) nem pipeline de CI no repositório.

## 7. Segurança e privacidade

- Nenhum segredo no cliente: todas as variáveis são públicas por desenho (`NEXT_PUBLIC_*`),
  e arquivos `.env*` ficam fora do Git (exceto `.env.example`).
- Sem backend, sem banco, sem coleta de dados pessoais: o contato acontece no WhatsApp.
- Dependências fixadas por `package-lock.json`.
- O único `dangerouslySetInnerHTML` serializa JSON-LD gerado pelo próprio código (sem
  entrada de usuário).

## 8. Build e deploy

**Fluxo do código à produção**

```
 Dev local          Git (branch)            Plataforma de deploy        Produção
 npm run dev  ───►  push / pull request ──► build automático        ──► CDN global
 lint+typecheck                              (next build, Turbopack)     + domínio próprio
                                             preview por branch          HTTPS automático
```

1. **Desenvolvimento:** `npm run dev` (Turbopack, HMR).
2. **Portões de qualidade:** `npm run lint`, `npm run typecheck`, `npm run build`.
3. **Configuração por ambiente:** variáveis `NEXT_PUBLIC_*` definidas no painel da plataforma
   (modelo em `.env.example`), separadas por ambiente (preview × produção).
4. **Build e publicação:** a plataforma executa `next build`; páginas estáticas vão para a CDN
   e metadados dinâmicos (OG, sitemap, robots) são gerados no build/edge.
5. **Previews e rollback:** cada branch/PR gera uma URL de preview; reverter é promover um
   deploy anterior.
6. **Pós-deploy:** domínio e HTTPS gerenciados, `SITE_URL` correto para canonical/OG/sitemap,
   verificação de eventos no `dataLayer`.

> Observação: o repositório não contém arquivos de pipeline (CI) nem de plataforma
> (`vercel.json`); o deploy usa os padrões do Next.js. Adicionar um workflow de CI com
> lint, typecheck e build é o próximo passo natural.

## 9. Resultados e aprendizados

- Integrar 3D, scroll e React sem re-render por frame exige separar **estado de render** de
  **estado de animação**.
- Orçamento de performance precisa ser parâmetro de configuração, não constante espalhada.
- Fallbacks (pôster, sem WebGL, reduced motion) tornam o recurso "uau" seguro para produção.
- Isolar conteúdo e configuração da empresa deixou o projeto reutilizável para outras marcas.

## 10. Como executar

```bash
cp .env.example .env.local   # defina marca, WhatsApp e domínio
npm install
npm run dev                  # http://localhost:3000
npm run lint && npm run typecheck && npm run build
```

## 11. Competências demonstradas

TypeScript · React 19 · Next.js 16 (App Router) · three.js / React Three Fiber · GSAP ·
Tailwind CSS 4 · Performance web · Acessibilidade · SEO técnico · Analytics (dataLayer) ·
Arquitetura de front-end · Pipeline de assets (Node/sharp) · Git e deploy por plataforma.
