import { Afirmacao, Gasto } from "./types";

export const AFIRMACOES: Afirmacao[] = [
  {
    id: 1,
    texto: "O consumo consciente não restringe sua liberdade física; ele financia a sua liberdade de tempo.",
    autor: "Princípio da Mente Minimalista"
  },
  {
    id: 2,
    texto: "Preço é o que você paga. Valor real é o impacto que aquilo traz para a sua paz mental.",
    autor: "Warren Buffett (adaptado)"
  },
  {
    id: 3,
    texto: "Riqueza espiritual e mental não consistem em acumular posses, mas em dominar os próprios desejos.",
    autor: "Sêneca"
  },
  {
    id: 4,
    texto: "Não compre para preencher um tédio ou uma ansiedade passageira. O custo emocional é sempre maior do que o preço na etiqueta.",
    autor: "Psicologia Econômica"
  },
  {
    id: 5,
    texto: "Saber o limite dos seus desejos é a verdadeira riqueza. Quem muito deseja, sempre será um servo do amanhã.",
    autor: "Provérbio Filosófico"
  },
  {
    id: 6,
    texto: "A paz financeira reside em gastar menos do que se ganha para comprar o ativo mais valioso do mundo: a sua liberdade de escolha.",
    autor: "Mente & Bolso"
  },
  {
    id: 7,
    texto: "Cada centavo economizado em frivolidades é um bloco de concreto colocado na fundação da sua estabilidade futura.",
    autor: "Consumo Consciente"
  }
];

export const GASTOS_INICIAIS: Gasto[] = [
  {
    id: "g-1",
    item: "Livro de Filosofia Estoica",
    valor: 49.90,
    sentimento: "Necessário",
    data: "2026-06-18"
  },
  {
    id: "g-2",
    item: "Assinatura de streaming que não assisto",
    valor: 55.90,
    sentimento: "Entediado",
    data: "2026-06-17"
  },
  {
    id: "g-3",
    item: "Pedido de delivery gigante no impulso",
    valor: 112.50,
    sentimento: "Ansioso",
    data: "2026-06-16"
  },
  {
    id: "g-4",
    item: "Café especial na padaria premium",
    valor: 18.00,
    sentimento: "Feliz",
    data: "2026-06-15"
  }
];
