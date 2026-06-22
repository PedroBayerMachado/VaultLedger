export interface Gasto {
  id: string;
  item: string;
  valor: number;
  sentimento: 'Feliz' | 'Ansioso' | 'Entediado' | 'Necessário';
  data: string;
}

export interface Afirmacao {
  id: number;
  texto: string;
  autor: string;
}
