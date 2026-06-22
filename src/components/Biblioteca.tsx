import React, { useState } from "react";
import { BookOpen, Filter, Minimize2, Maximize2, ShieldAlert, Key, Sparkles, BookMarked, Landmark, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "./Toast";

interface BookSummary {
  id: string;
  titulo: string;
  autor: string;
  categoria: "Investimentos" | "Mentalidade" | "Dívidas" | "Negócios";
  resumoCurto: string;
  pontosCríticos: string[];
  citaçãoCelebre: string;
  corEstilo: string;
}

const ACERVO_LIVROS: BookSummary[] = [
  {
    id: "homem_rico_babilonia",
    titulo: "O Homem Mais Rico da Babilônia",
    autor: "George S. Clason",
    categoria: "Mentalidade",
    resumoCurto: "A obra clássica que ensina princípios de controle de despesa e investimento de forma narrativa através das paródias do povo babilônico e do sábio Arkad.",
    pontosCríticos: [
      "Pague-se a si mesmo em primeiro lugar: no mínimo 10% de toda sua receita pertence exlusivamente a você.",
      "Controle as despesas prioritárias e renegocie ou liquide fardos e juros de dívidas ansiosas.",
      "Proteja seu principal: consulte homens sábios de reputação sólida e examine as garantias antes de aplicar capital.",
      "Trabalhe diligentemente em seu ofício atual para aumentar seu próprio valor de hora no mercado."
    ],
    citaçãoCelebre: "A riqueza, como uma árvore, cresce a partir de uma semente minúscula. A primeira moeda que você poupa é a semente de onde sua árvore de riqueza crescerá.",
    corEstilo: "from-amber-600 to-amber-700"
  },
  {
    id: "pai_rico_pai_pobre",
    titulo: "Pai Rico, Pai Pobre",
    autor: "Robert T. Kiyosaki",
    categoria: "Investimentos",
    resumoCurto: "Desafia o padrão convencional de ensino de finanças, definindo de maneira definitiva os conceitos de ativos, passivos e como fugir da Corrida dos Ratos.",
    pontosCríticos: [
      "Ativos geram fluxos de renda passivos adicionais para você (colocam dinheiro no seu bolso).",
      "Passivos tiram dinheiro de forma recorrente do seu bolso sob forma de manutenção ou prestações.",
      "A classe média e baixa trabalha por dinheiro; os ricos fazem o dinheiro trabalhar diligentemente por eles.",
      "Aprender a investir em si mesmo e obter alfabetização contábil instrumental dita seu nível de autonomia."
    ],
    citaçãoCelebre: "Os ricos compram ativos. A classe média compra obrigações e passivos pensando que são ativos verdadeiros.",
    corEstilo: "from-indigo-650 to-purple-850"
  },
  {
    id: "psicologia_financeira",
    titulo: "A Psicologia Financeira",
    autor: "Morgan Housel",
    categoria: "Mentalidade",
    resumoCurto: "Explica que gerir dinheiro depende muito mais do seu comportamento subconsciente, ego e controle do que de sua proficiência de cálculos lógicos.",
    pontosCríticos: [
      "Ser rico é ter um saldo atual; ser próspero é ter escolhas ocultas que geram a verdadeira liberdade de tempo.",
      "A maior recompensa invisível do dinheiro é a flexibilidade acordar todos os dias e fazer o que quiser.",
      "O ego gasta recursos para mostrar riqueza inexistente; a riqueza é o patrimônio oculto que ainda não foi consumido.",
      "Margens de segurança e espaço para imprevistos mentais são vitais para enfrentar o vento do caos do mercado."
    ],
    citaçãoCelebre: "Fazer dinheiro é uma questão de habilidade e risco. Conservar dinheiro é uma disciplina puramente de humildade e sobriedade.",
    corEstilo: "from-emerald-650 to-teal-750"
  },
  {
    id: "segredos_mente_milionaria",
    titulo: "Os Segredos da Mente Milionária",
    autor: "T. Harv Eker",
    categoria: "Mentalidade",
    resumoCurto: "Discorre sobre a importância de reprogramar o seu modelo interno financeiro estéril gravado na infância por preconceitos ou heranças disfuncionais.",
    pontosCríticos: [
      "Pensamentos geram sentimentos, sentimentos conduzem a ações conscientes e ações produzem resultados reais.",
      "Quem se orgulha de criticar pessoas prósperas afasta de si a própria possibilidade de prosperidade.",
      "Ricos escolhem ser pagos com base em seus resultados e entregas de valor; pobres escolhem com base puramente no tempo decorrido.",
      "Administre o dinheiro independente da quantia atual. A disciplina de alocação de gavetas precede o caixa."
    ],
    citaçãoCelebre: "Se você quer mudar os frutos de uma árvore, primeiro precisa alterar as raízes. Se quer mudar o visível, antes precisa alterar o invisível.",
    corEstilo: "from-blue-700 to-slate-800"
  },
  {
    id: "como_sair_das_dividas",
    titulo: "Como Sair das Dívidas com Dignidade",
    autor: "Lógica do Escudo",
    categoria: "Dívidas",
    resumoCurto: "Método objetivo de reestruturação fiduciária pessoal baseado nas leis de Arkad, focando em restaurar auto-estima mental e fluxo saudável.",
    pontosCríticos: [
      "Cesse imediatamente novos endividamentos: congele cartões de crédito e cancele limites de cheque especial compulsórios.",
      "Reserve 20% do faturamento líquido para quitar devedores, mantendo 10% para poupar e 75% para necessidades básicas.",
      "Apresente esse plano fixo de reembolso aos credores com prazos honestos e firmes, garantindo estabilidade civil.",
      "Não faça acordos abusivos sob pressão sem fluxo garantido para respaldar o adimplemento definitivo."
    ],
    citaçãoCelebre: "Um homem que acumula dívidas das quais foge é escravo de terceiros. O homem que senta e as resolve com honra é livre de espírito.",
    corEstilo: "from-red-700 to-rose-850"
  }
];

export default function Biblioteca() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tudo");
  const [focusMode, setFocusMode] = useState(false);
  const [activeBook, setActiveBook] = useState<BookSummary | null>(null);

  const categorias = ["Tudo", "Investimentos", "Mentalidade", "Dívidas", "Negócios"];

  const filteredBooks = ACERVO_LIVROS.filter((book) => {
    if (selectedCategory === "Tudo") return true;
    return book.categoria === selectedCategory;
  });

  const toggleFocusMode = (book: BookSummary) => {
    setActiveBook(book);
    setFocusMode(true);
    showToast("Modo Foco de Leitura Ativado. Sem distrações.", "info");
  };

  const closeFocusMode = () => {
    setFocusMode(false);
    showToast("Modo Foco desativado.", "info");
  };

  return (
    <section id="biblioteca" className="py-24 bg-[#F9FAFB] border-b border-stone-200/50 px-6 md:px-12 text-left relative">
      
      {/* Dynamic Immersive Focus Mode Fullscreen view */}
      <AnimatePresence>
        {focusMode && activeBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#F5F5F0] overflow-y-auto px-6 py-12 md:py-20 flex flex-col items-center"
          >
            <div className="max-w-2xl w-full text-stone-900 flex flex-col justify-between min-h-full">
              
              {/* Focus mode header */}
              <div className="flex justify-between items-center pb-6 border-b border-stone-200 mb-10 md:mb-16">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#CA8A04] font-bold flex items-center gap-1.5 matches-focus">
                  <BookMarked className="w-4 h-4 animate-pulse" /> / biblioteca de babilônia
                </span>
                
                <button
                  onClick={closeFocusMode}
                  id="exit-focus-mode-btn"
                  className="px-3 py-1.5 rounded-lg border border-stone-300 hover:border-stone-500 hover:bg-stone-200/50 bg-[#fbfbf9] text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  Sair do Foco
                </button>
              </div>

              {/* Main Reading core */}
              <div className="flex-1 text-left">
                <span className="text-[10px] font-mono uppercase bg-yellow-100 text-[#CA8A04] border border-yellow-200 px-2.5 py-0.5 rounded-sm font-bold block w-max mb-4">
                  {activeBook.categoria}
                </span>
                
                <h3 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold leading-tight tracking-tight mb-2">
                  {activeBook.titulo}
                </h3>
                
                <p className="text-sm font-sans font-medium text-stone-550 italic mb-8">
                  Por {activeBook.autor}
                </p>

                {/* Immersive quote block */}
                <blockquote className="border-l-4 border-[#CA8A04] pl-6 py-1 my-8 text-stone-700 italic font-serif text-lg sm:text-xl leading-relaxed">
                  "{activeBook.citaçãoCelebre}"
                </blockquote>

                {/* Body details */}
                <div className="space-y-6 text-stone-800 font-serif leading-relaxed text-sm sm:text-base mb-12">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-450">A tese central desta obra:</h4>
                  <p className="text-stone-650 font-light font-serif text-base">{activeBook.resumoCurto}</p>
                  
                  <div className="pt-6 border-t border-stone-200/50 space-y-4">
                    <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-450">Tópicos e Lições Críticas:</h4>
                    <ul className="space-y-3 font-sans text-xs sm:text-sm text-stone-650 font-light">
                      {activeBook.pontosCríticos.map((ponto, i) => (
                        <li key={i} className="flex gap-2.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04] shrink-0 mt-1.5" />
                          <span>{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Focus mode footer */}
              <div className="pt-8 border-t border-stone-200 text-center font-mono text-[10px] text-stone-400 mt-12">
                VaultLedger Library · Leia sem telas cintilantes ou notificações.
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        
        {/* Descriptive Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-[#CA8A04] font-semibold block mb-3">
              05 . Biblioteca de Babilônia
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
              A Sabedoria Escrita do Ouro
            </h2>
            <div className="w-12 h-[2px] bg-[#EAB308] my-4 rounded-full" />
            <p className="text-stone-500 text-sm font-light leading-relaxed max-w-xl">
              Alimente seu cérebro de insights transformadores do mercado de finanças e psicologia humana geral sem a superficialidade de feeds de redes sociais.
            </p>
          </div>

          {/* Category Filter Controls */}
          <div className="flex flex-wrap gap-1.5 bg-white border border-stone-200 p-1 rounded-xl self-start md:self-end">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  showToast(`Exibindo resumos: ${cat}`, "info");
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? "bg-[#CA8A04] text-white"
                    : "text-stone-500 hover:text-stone-850 hover:bg-stone-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Books summaries Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-stone-200 hover:border-[#CA8A04]/40 rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all duration-300"
            >
              <div>
                
                {/* Book Header badges */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] uppercase font-mono bg-stone-50 text-stone-500 border border-stone-200 px-2 py-0.5 rounded">
                    {book.categoria}
                  </span>
                  
                  <span className="font-sans font-bold text-[10px] text-stone-400 font-mono italic">
                    By {book.autor.split(" ").pop()}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-950 mb-2 leading-tight">
                  {book.titulo}
                </h3>
                
                <p className="text-xs text-stone-500 font-light leading-relaxed mb-6">
                  {book.resumoCurto}
                </p>

                {/* Visual quote indicator */}
                <div className="bg-stone-50 border-l-[3px] border-[#CA8A04] p-3 rounded-r-lg italic font-serif text-[11px] text-stone-600 mb-6">
                  "{book.citaçãoCelebre}"
                </div>

              </div>

              {/* Actions footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                
                <span className="text-[10px] font-mono text-stone-400 font-medium">
                  {book.pontosCríticos.length} lições salvas
                </span>

                <button
                  onClick={() => toggleFocusMode(book)}
                  id={`focus-mode-btn-${book.id}`}
                  className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-stone-950 hover:bg-[#CA8A04] text-white font-mono text-[9px] uppercase tracking-wider font-semibold transition-all cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  Ativar Modo Foco
                </button>
                
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
