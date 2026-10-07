import type { Benefit, Occasion, ProductChapter, Step } from "@/lib/types";

/**
 * Editorial copy. Facts about the product come from its packaging and the
 * brand's official ad: gelo para drinks, sabor água de coco, 200 ml, gelo de
 * coco com sabor artificial, guardar no congelador. Do not add nutritional,
 * ingredient, shelf-life or origin claims without confirmation.
 */

export const hero = {
  eyebrow: "Gelos Saborizados Premium",
  titleStart: "O detalhe que",
  titleEmphasis: "transforma",
  titleEnd: "sua bebida.",
  lead: "Gelo para drinks sabor água de coco: gela e dá sabor ao mesmo tempo.",
} as const;

export const productChapters: ProductChapter[] = [
  {
    id: "pack",
    eyebrow: "Gelo para drinks",
    title: "Gelo que já chega",
    titleAccent: "com sabor.",
    body: "Um pack de 200 ml de gelo de coco que gela e dá sabor ao drink ao mesmo tempo.",
    align: "start",
  },
  {
    id: "gelo",
    eyebrow: "Translúcido",
    title: "Gelo que dá pra",
    titleAccent: "ver através.",
    body: "Ele vai soltando o sabor no copo enquanto derrete.",
    align: "end",
  },
  {
    id: "sabor",
    eyebrow: "Sabor",
    title: "Água de coco,",
    titleAccent: "gelada.",
    body: "Leve e refrescante, com o final adocicado do coco. Vai bem com gin, vodka, rum e caipirinha.",
    align: "start",
  },
  {
    id: "pronto",
    eyebrow: "No copo",
    title: "Do congelador",
    titleAccent: "direto pro drink.",
    body: "Sem preparo e sem bagunça.",
    align: "end",
    specs: [
      { label: "Conteúdo", value: "200 ml" },
      { label: "Sabor", value: "Água de coco" },
      { label: "Produto", value: "Gelo de coco com sabor artificial" },
      { label: "Guardar", value: "No congelador" },
    ],
  },
];

export const benefits: Benefit[] = [
  {
    title: "Sabor intenso",
    body: "Feito para entrar em campo do primeiro ao último lance — o sabor acompanha o drink inteiro.",
  },
  {
    title: "Mais durabilidade",
    body: "Que o gelo comum. Mais tempo, mais sabor no copo.",
  },
  {
    title: "Praticidade",
    body: "Já vem pronto no pack de 200 ml. Do congelador direto pro drink.",
  },
];

export const steps: Step[] = [
  { title: "Tire do congelador", body: "Mantenha congelado até a hora de servir." },
  { title: "Abra e coloque no copo", body: "Direto da embalagem para o seu drink." },
  { title: "Sirva sua bebida", body: "Gin, vodka, rum, caipirinha, suco ou o que preferir." },
];

export const occasions: Occasion[] = [
  {
    title: "Drinks & cocktails",
    body: "Gin tônica, caipirinha, rum, vodka e drinks autorais.",
    tone: "forest",
  },
  {
    title: "Sem álcool",
    body: "Sucos, refrigerantes, água com gás, cafés gelados.",
    tone: "ice",
  },
  {
    title: "Em casa",
    body: "Aquele drink de fim de tarde, sem trabalho nenhum.",
    tone: "coconut",
  },
  {
    title: "Eventos",
    body: "Festas, jogos e confraternizações com os amigos.",
    tone: "night",
  },
];

export const finalCta = {
  eyebrow: "Pronto para provar?",
  title: "Quero experimentar",
  body: "Fale direto com a gente pelo WhatsApp. Sem formulário, sem cadastro.",
} as const;
