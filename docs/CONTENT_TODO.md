# Informações pendentes da empresa

Nada abaixo foi inventado — tudo que não veio da embalagem ou do anúncio oficial está como
placeholder até ser confirmado.

| Informação | Onde preencher | Estado atual |
|---|---|---|
| Nome da marca | `NEXT_PUBLIC_BRAND_NAME` (`.env.local`) | ✅ Ignite V6 Oficial (padrão em `lib/constants.ts`) |
| Frase da marca | `content/product.ts` (`hero`) | ✅ "Gelos Saborizados Premium — O detalhe que transforma sua bebida." |
| Produto: sabor Água de Coco, 200 ml, "gelo de coco com sabor artificial", guardar no congelador | `content/product.ts`, `content/flavors.ts` | ✅ vindo da embalagem |
| Textos de "sabor intenso" e "mais durabilidade" | `content/product.ts` (`benefits`) | ✅ vindos do anúncio oficial da marca — confirmar que podem ir ao site |
| Número do WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` | vazio → link `wa.me` sem número |
| Domínio | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` (afeta canonical, OG, sitemap) |
| Instagram | `NEXT_PUBLIC_INSTAGRAM_URL` | oculto |
| Região de entrega | `NEXT_PUBLIC_DELIVERY_REGION` | oculto |
| Outros sabores + descrições + arte da embalagem | `content/flavors.ts`, `public/textures` (ver `docs/PACK_TEXTURE.md`) | Limão, Morango e Maracujá são `placeholder` com `[DESCRIÇÃO DO SABOR]`; mostram uma silhueta da embalagem |
| Fotos de drinks / eventos | campo `image` em `occasions` (`content/product.ts`) | blocos de cor |
| Logo | `ignitev6_sem_fundo.jpg` → `npm run build:logo` | ✅ gerada (navbar, rodapé, favicon, OG). Ideal: enviar PNG/SVG com transparência real |
| Preço, ingredientes, validade, pagamento, horários | `lib/constants.ts` (ex.: `PRODUCT_PRICE`) | não exibidos |

Quando os sabores estiverem confirmados: troque `status` para `"confirmed"` e, se quiser esconder
os não confirmados, defina `SHOW_PLACEHOLDER_FLAVORS = false` em `lib/constants.ts`.

Revise também os textos em `content/product.ts`. Não acrescente claims nutricionais, de
ingredientes ou de origem sem confirmação. A embalagem diz "gelo de coco com sabor artificial":
não escreva "100% natural" nem similares.
