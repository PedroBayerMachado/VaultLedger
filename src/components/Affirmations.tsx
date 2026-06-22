import React, { useState } from "react";
import { Sparkles, Quote, Shuffle, ChevronLeft, ChevronRight, Coins, Shield, TrendingUp, Compass, Award, LifeBuoy, HelpCircle, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PrincipioBabilocino {
  id: number;
  texto: string;
  modernizacao: string;
}

const CONSELHOS_ORACULO: PrincipioBabilocino[] = [
  {
    id: 1,
    texto: "Pagar-se a si mesmo em primeiro lugar: Pelo menos dez por cento de tudo o que você ganha pertence exclusivamente a você para guardar.",
    modernizacao: "Separe 10% de sua renda mensal diretamente no boleto de investimento assim que o salário cair. Nunca poupe apenas o que sobra."
  },
  {
    id: 2,
    texto: "Controle as despesas de forma que você tenha recursos para pagar suas necessidades e desejos sem exceder os noventa por cento de seus rendimentos.",
    modernizacao: "Elimine custos fixos desnecessários. Assinaturas de streaming não utilizadas ou serviços triviais enfraquecem o seu patrimônio."
  },
  {
    id: 3,
    texto: "Não busque o lucro rápido e ilusório. O ouro foge do homem que cobiça lucros irrealizáveis ou que confia nos conselhos enganosos de trapaceiros.",
    modernizacao: "Fique longe de apostas esportivas, pirâmides ou 'gurus' do enriquecimento fácil. A riqueza verdadeira é construída com tempo e consistência."
  },
  {
    id: 4,
    texto: "Incorpore o hábito de buscar o conselho de homens sábios que lidam diariamente com o ouro, protegendo seu tesouro de perdas drásticas.",
    modernizacao: "Leia relatórios certificados, consulte especialistas neutros ou siga a sabedoria de investidores consolidados antes de arriscar seu capital."
  },
  {
    id: 5,
    texto: "Aumente sua competência para ganhar: O homem que busca educar-se e aprender mais sobre seu ofício sempre obterá maior recompensa financeira.",
    modernizacao: "Invista de forma contínua em cursos, livros e mentorias de carreira. O seu cérebro é o ativo que gera os maiores dividendos."
  },
  {
    id: 6,
    texto: "Assegure uma renda de velhice e a proteção de sua própria família para quando você não puder mais produzir com a força do seu trabalho.",
    modernizacao: "Monte sua Reserva de Emergência (6 meses de custo de vida) e diversifique seu patrimônio em renda fixa de longo prazo e previdência estruturada."
  },
  {
    id: 7,
    texto: "Não ceda ao tédio ou à ansiedade comprando aquilo que não serve a seu propósito real de vida, apenas para simular um estilo idealizado.",
    modernizacao: "Gastar para impressionar terceiros é o caminho mais rápido para a pobreza espiritual e o desastre orçamentário pessoal."
  }
];

const SETE_SOLUCOES = [
  {
    numero: "I",
    titulo: "Comece a encher sua carteira",
    legado: "De cada dez moedas que colocar, retire apenas nove para gastar.",
    moderno: "Guarde no mínimo 10% da sua renda ativa mensal antes de sequer pagar as contas diárias.",
    icone: Coins
  },
  {
    numero: "II",
    titulo: "Controle seus gastos",
    legado: "Diferencie necessidades inevitáveis de caprichos voluntários.",
    moderno: "Mantenha o padrão de estilo de vida consciente, podando luxos desnecessários motivados pelo tédio.",
    icone: Shield
  },
  {
    numero: "III",
    titulo: "Multiplique seu ouro",
    legado: "Faça com que cada moeda produza filhos que gerem novos frutos.",
    moderno: "Reinvista os juros e dividendos do seu patrimônio para ativar os juros compostos no longo prazo.",
    icone: TrendingUp
  },
  {
    numero: "IV",
    titulo: "Proteja seu tesouro contra a perda",
    legado: "A segurança deve ser seu lema: não arrisque sem garantia.",
    moderno: "Evite apostas, pirâmides e especulações de alto risco. Defenda o principal com unhas e dentes.",
    icone: Compass
  },
  {
    numero: "V",
    titulo: "Faça do lar um investimento rentável",
    legado: "Possuir a sua própria habitação reduz o custo de vida e traz paz.",
    moderno: "More de maneira confortável e sustentável, garantindo que o custo com habitação não asfixie o seu caixa.",
    icone: Award
  },
  {
    numero: "VI",
    titulo: "Assegure uma renda futura",
    legado: "Preveja provisões para a velhice e para a segurança dos seus.",
    moderno: "Crie uma carteira de investimentos com foco em perpetuidade e geração de renda passiva constante.",
    icone: LifeBuoy
  },
  {
    numero: "VII",
    titulo: "Aumente sua capacidade de ganho",
    legado: "Aprimore suas habilidades técnicas e cultive sabedoria mental.",
    moderno: "Estude, aprenda novos idiomas, otimize seu trabalho e aumente o valor da sua hora no mercado dinâmico.",
    icone: GraduationCap
  }
];

const CINCO_LEIS = [
  {
    lei: "1ª Lei de Ouro",
    texto: "O ouro vem voluntariamente e em quantidades crescentes para o homem que poupa não menos de um décimo de seus ganhos, visando criar um patrimônio para o seu futuro e de sua família.",
    insight: "Seja persistente na disciplina inicial. O dinheiro atrai mais dinheiro à medida que o montante guardado consolida consistência."
  },
  {
    lei: "2ª Lei de Ouro",
    texto: "O ouro trabalha diligente e satisfatoriamente para o proprietário sábio que encontra para ele uma ocupação lucrativa, multiplicando-se como os rebanhos no campo.",
    insight: "Cada real investido é um trabalhador que trabalha 24h por dia para você. Deixe o tempo multiplicar os seus esforços passivos."
  },
  {
    lei: "3ª Lei de Ouro",
    texto: "O ouro adere à proteção do proprietário cauteloso que o investe sob os conselhos de homens sábios em seu manuseio.",
    insight: "Sua ignorância técnica tem um custo altíssimo. Sempre consulte especialistas neutros ou estude profundamente antes de alocar capital."
  },
  {
    lei: "4ª Lei de Ouro",
    texto: "O ouro foge do homem que o investe em negócios com os quais não está familiarizado ou que não são aprovados por aqueles que sabem poupar.",
    insight: "Não arrisque em negócios glamorosos apenas pela moda. Priorize mercados e ativos consolidados, que você compreende de fato."
  },
  {
    lei: "5ª Lei de Ouro",
    texto: "O ouro escapa do homem que o força a ganhos impossíveis, ou que ouve o conselho sedutor de trapaceiros, ou que confia em sua própria inexperiência e românticos desejos.",
    insight: "A ganância extrema cega a razão. Sempre que lhe oferecerem lucros rápidos fora do padrão de mercado, desconfie imediatamente."
  }
];

export default function Affirmations() {
  const [activeTab, setActiveTab] = useState<"solucoes" | "leis">("solucoes");
  const [currentLeiIndex, setCurrentLeiIndex] = useState(0);
  const [oraculoConselho, setOraculoConselho] = useState<PrincipioBabilocino>(CONSELHOS_ORACULO[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  const nextLei = () => {
    setCurrentLeiIndex((prev) => (prev + 1) % CINCO_LEIS.length);
  };

  const prevLei = () => {
    setCurrentLeiIndex((prev) => (prev - 1 + CINCO_LEIS.length) % CINCO_LEIS.length);
  };

  const consultarOraculo = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * CONSELHOS_ORACULO.length);
      setOraculoConselho(CONSELHOS_ORACULO[idx]);
      setIsSpinning(false);
    }, 400);
  };

  return (
    <section
      id="mentalidade"
      className="py-24 bg-[#F9FAFB] border-b border-stone-200/50 relative overflow-hidden px-6 md:px-12 text-left"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header Descritivo */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#CA8A04] font-semibold block mb-3">
            01 . O Templo da Sabedoria
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
            Ensinamentos Críticos da Babilônia
          </h2>
          <div className="w-12 h-[2px] bg-[#EAB308] mx-auto my-5 rounded-full" />
          <p className="text-stone-500 text-sm sm:text-base font-light leading-relaxed">
            Reprograme sua visão de consumo. Os preceitos de <span className="italic font-serif text-stone-800">O Homem Mais Rico da Babilônia</span> explicam que a riqueza reside no controle dos impulsos e nas leis matemáticas do ouro.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Lado Esquerdo: Abas Elegantes */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Abas Modernas Branca e Dourada */}
            <div className="flex border border-stone-200 p-1 bg-white rounded-xl shadow-xs max-w-md">
              <button
                onClick={() => setActiveTab("solucoes")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg tracking-wide transition-all cursor-pointer ${
                  activeTab === "solucoes"
                    ? "bg-[#CA8A04] text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                }`}
              >
                As 7 Soluções para uma Carteira Vazia
              </button>
              <button
                onClick={() => setActiveTab("leis")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg tracking-wide transition-all cursor-pointer ${
                  activeTab === "leis"
                    ? "bg-[#CA8A04] text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                }`}
              >
                As 5 Leis de Ouro
              </button>
            </div>

            {/* Conteúdo das Abas com AnimatePresence */}
            <div className="min-h-[460px]">
              <AnimatePresence mode="wait">
                {activeTab === "solucoes" ? (
                  <motion.div
                    key="solucoes-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 shadow-xs mb-4">
                      <h4 className="font-serif text-stone-850 font-semibold text-base mb-2">
                        Como engordar sua carteira moderna
                      </h4>
                      <p className="text-stone-500 text-xs font-light leading-relaxed">
                        Os princípios milenares de Arkad aplicados pragmaticamente à sua conta bancária corrente. Domine o controle para construir sua liberdade física.
                      </p>
                    </div>

                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {SETE_SOLUCOES.map((sol, idx) => {
                        const IconComponent = sol.icone;
                        return (
                          <div
                            key={idx}
                            className="p-4 bg-white border border-stone-200/60 rounded-xl hover:border-[#CA8A04]/40 hover:shadow-xs transition-all duration-300 flex gap-4"
                          >
                            <div className="w-10 h-10 rounded-lg bg-yellow-50 border border-yellow-100 flex items-center justify-center text-[#CA8A04] shrink-0">
                              <span className="font-serif font-bold text-xs">{sol.numero}</span>
                            </div>
                            <div className="text-left flex-1">
                              <h5 className="font-semibold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                                {sol.titulo}
                              </h5>
                              <p className="text-[11px] text-[#CA8A04] italic font-serif mt-1">
                                "{sol.legado}"
                              </p>
                              <p className="text-xs text-stone-500 font-light mt-1.5 leading-relaxed">
                                <strong className="font-semibold text-stone-700">Modernidade:</strong> {sol.moderno}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="leis-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Slideshow Minimalista de Leis de Ouro */}
                    <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 shadow-xs relative overflow-hidden min-h-[280px] flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100/20 rounded-full filter blur-xl pointer-events-none" />
                      
                      <div>
                        <div className="inline-block px-3 py-1 bg-yellow-50 border border-yellow-100 rounded-full text-[10px] font-mono text-[#CA8A04] uppercase font-bold mb-4">
                          {CINCO_LEIS[currentLeiIndex].lei}
                        </div>
                        <p className="font-serif italic text-base sm:text-lg text-stone-850 leading-relaxed text-left">
                          "{CINCO_LEIS[currentLeiIndex].texto}"
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-stone-100 text-left">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 block mb-1">Moderno Insight</span>
                        <p className="text-xs text-[#CA8A04] font-medium leading-relaxed">
                          {CINCO_LEIS[currentLeiIndex].insight}
                        </p>
                      </div>
                    </div>

                    {/* Controles de Navegação */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {CINCO_LEIS.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentLeiIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              currentLeiIndex === idx ? "bg-[#CA8A04] w-6" : "bg-stone-300"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={prevLei}
                          className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer text-stone-600 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextLei}
                          className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer text-stone-600 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Lado Direito: Oráculo da Babilônia */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden bg-white border border-stone-200 rounded-3xl p-8 shadow-xs text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full filter blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-yellow-50 border border-yellow-100 rounded-xl text-[#CA8A04]">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                </div>
                <h3 className="font-serif text-lg text-stone-900 font-semibold">
                  O Oráculo da Babilônia
                </h3>
              </div>

              <p className="text-xs text-stone-500 font-light mb-6 leading-relaxed">
                Está em dúvida antes de gastar ou investir? Toque no botão para canalizar a sabedoria secular do oráculo. Ele buscará uma conselho antigo traduzido para o equilíbrio financeiro contemporâneo.
              </p>

              {/* Box de Exibição do Oráculo */}
              <div className="bg-stone-50 border border-stone-150 rounded-2xl p-6 min-h-[200px] flex flex-col justify-between mb-6 relative">
                <div className="absolute top-4 left-4 text-[#CA8A04]/10">
                  <Quote className="w-12 h-12 transform -scale-x-100" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={oraculoConselho.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 flex-1 flex flex-col justify-between space-y-4"
                  >
                    <p className="font-serif italic text-sm text-stone-850 leading-relaxed">
                      "{oraculoConselho.texto}"
                    </p>
                    
                    <div className="pt-3 border-t border-stone-200/50">
                      <span className="text-[9px] uppercase tracking-wider font-mono text-[#CA8A04] font-bold block">
                        Equivalente Moderno
                      </span>
                      <p className="text-xs text-stone-600 mt-1 font-sans">
                        {oraculoConselho.modernizacao}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Botão de Shuffle do Oráculo */}
              <button
                onClick={consultarOraculo}
                disabled={isSpinning}
                id="oraculo-click-btn"
                className={`w-full py-3.5 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:bg-[#CA8A04] hover:shadow-[0_0_15px_rgba(202,138,4,0.25)] ${
                  isSpinning ? "opacity-70 scale-95" : "hover:scale-[1.02] active:scale-95"
                }`}
              >
                <Shuffle className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
                {isSpinning ? "Canalizando Ouro..." : "Invocar Sabedoria do Oráculo"}
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
