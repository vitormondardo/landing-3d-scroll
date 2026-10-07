# Embalagem 3D — como trocar a textura e adicionar sabores

A embalagem do `ProductExperience` não é um modelo GLB: é uma geometria "pillow" gerada em código
(`components/product/scene/Pack.tsx`) com a **arte da embalagem como textura**. Isso mantém o peso
baixo (a textura atual tem ~118 KB) e permite trocar a arte sem modelar nada.

## Trocar a arte (ou adicionar um sabor)

1. Exporte a arte da embalagem **de frente, com fundo transparente**, em WebP com alpha:
   - proporção da embalagem (a atual é 465 × 1257);
   - recorte justo, sem margem — o contorno do alpha define onde as gotas de condensação aparecem;
   - bordas serrilhadas do selo no topo/base podem ficar no alpha, elas aparecem no 3D.
2. Salve em `public/textures/`, por exemplo `pack-limao.webp`.
3. Em `content/flavors.ts`, aponte o sabor para o arquivo:
   ```ts
   pack: { src: "/textures/pack-limao.webp", alt: "Embalagem … sabor Limão" },
   ```
   O card do sabor passa a mostrar a arte no lugar da silhueta.
4. Se a proporção for diferente, atualize `PACK.width` / `PACK.height` em `lib/constants.ts`.

A cena 3D usa o sabor retornado por `featuredFlavor` (o primeiro com `pack`). Para destacar outro
sabor, reordene a lista ou ajuste `featuredFlavor`.

## De onde veio a textura atual

`public/textures/pack-agua-de-coco.webp` foi extraída do protótipo `geloignite-3d.html` com:

```bash
npm run extract:pack -- "<caminho>/geloignite-3d.html"
```

## Quer um modelo 3D de verdade?

Se a empresa passar a ter um modelo modelado (GLB), o ponto de troca é `Pack.tsx`: substituir a
geometria por `useGLTF`, mantendo o `group` que recebe a posição/rotação do `SceneFrame`. Use
Draco (`gltf-transform optimize … --compress draco`) e mire em < 500 KB.
