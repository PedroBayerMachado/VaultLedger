import React from "react";
import { ArrowDown, Coins, ShieldCheck, Heart, Sparkles, BookOpen } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  const scrollToCalculator = () => {
    const element = document.getElementById("calculadora");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const scrollToTracker = () => {
    const element = document.getElementById("rastreador");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden px-6 md:px-12"
    >
      {/* Elegante background decorativo - Bauhaus minimalista / deconstructivista */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Círculo dourado de gradiente grande e suave */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-linear-to-b from-[#fdfad9]/30 to-[#fdfad9]/0 filter blur-3xl opacity-60 md:opacity-80" />
        {/* Outro no canto inferior esquerdo */}
        <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] rounded-full bg-linear-to-r from-amber-100/10 to-transparent filter blur-2xl" />
        {/* Linha fina moderna de vetor como detalhe */}
        <div className="absolute top-1/2 left-10 md:left-24 w-[200px] h-[1px] bg-stone-300/40 transform -rotate-12 hidden lg:block" />
        <div className="absolute bottom-1/4 right-24 w-[150px] h-[1px] bg-stone-300/40 transform rotate-45 hidden lg:block" />
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Texto Lateral */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#dfdfdb]/60 shadow-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-stone-600 font-semibold">
              Harmonia Financeira & Cognitiva
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight text-stone-900 leading-[1.1] mb-6">
            O Equilíbrio entre a <br />
            <span className="font-serif italic text-[#CA8A04] relative">Sabedoria Milenar</span> <br />
            e a <span className="font-sans font-semibold">Matemática Ativa</span>.
          </h1>

          <p className="font-sans text-stone-500 text-base sm:text-lg max-w-xl mb-8 leading-relaxed font-light animate-fade-in">
            A verdadeira riqueza não reside apenas no que se ganha, mas em dominar o próprio espírito. Combine o legado milenar de <span className="font-semibold text-stone-850">O Homem Mais Rico da Babilônia</span> com o rigor pragmático da matemática financeira moderna.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <button
              onClick={scrollToTracker}
              id="hero-cta-tracker"
              className="px-8 py-3.5 text-sm font-semibold rounded-xl bg-stone-900 text-white hover:bg-[#CA8A04] hover:text-white hover:shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer relative overflow-hidden group"
            >
              <span className="relative z-10">Rastrear Meus Hábitos</span>
              <span className="absolute inset-x-0 h-full w-12 bg-white/20 transform -skew-x-[25deg] -translate-x-[150%] group-hover:animate-shine top-0 left-0" style={{ animationDuration: '1.5s' }} />
            </button>
            <button
              onClick={scrollToCalculator}
              id="hero-cta-calculator"
              className="px-8 py-3.5 text-sm font-semibold rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 hover:border-stone-300 hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              Calculadora de Renda & Sabedoria
            </button>
          </div>

          {/* Mini features em linha */}
          <div className="grid grid-cols-3 gap-6 mt-12 w-full pt-8 border-t border-stone-200/50">
            <div>
              <div className="font-mono text-xl font-bold text-stone-900">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-stone-400 font-mono mt-1">
                Privacidade (Local)
              </div>
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-stone-900">50/30/20</div>
              <div className="text-[11px] uppercase tracking-wider text-stone-400 font-mono mt-1">
                Método de Sucesso
              </div>
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-stone-900">Mente</div>
              <div className="text-[11px] uppercase tracking-wider text-stone-400 font-mono mt-1">
                Atitudes Saudáveis
              </div>
            </div>
          </div>
        </div>

        {/* Card visual interativo lateral */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          
          {/* Caixa sutil bento premium de demonstração */}
          <div className="relative w-full max-w-[380px] aspect-square rounded-3xl border border-[#dfdfdb]/80 p-8 bg-white/70 backdrop-blur-md shadow-2xl shadow-stone-200/50 flex flex-col justify-between overflow-hidden">
            
            {/* Elemento de iluminação interna */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full filter blur-xl pointer-events-none" />

            {/* Topo do card */}
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-stone-900 flex items-center justify-center text-white">
                <Coins className="w-6 h-6 text-amber-400" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full border border-stone-200/65">
                Mindset Card
              </span>
            </div>

            {/* Centro */}
            <div className="my-6">
              <p className="font-serif italic text-xl md:text-2xl text-stone-900 leading-snug">
                "Não compre para anestesiar uma emoção passageira."
              </p>
              <div className="h-[2px] w-12 bg-amber-400 rounded-full mt-4" />
            </div>

            {/* Base */}
            <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-150">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-semibold text-stone-700">Equilíbrio Ativo</span>
              </div>
              <span className="text-[10px] font-mono text-stone-400">Relação Saudável</span>
            </div>
          </div>

          {/* Elemento flutuante de humor */}
          <div className="absolute -bottom-6 -left-4 bg-white border border-[#dfdfdb] p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emoji-sm font-bold text-emerald-800">
              😌
            </div>
            <div>
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider leading-none">Último status</div>
              <div className="text-xs font-semibold text-stone-800">Consumo Pleno</div>
            </div>
          </div>

          {/* Elemento flutuante 50/30/20 */}
          <div className="absolute -top-6 -right-2 bg-white border border-[#dfdfdb] p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 font-bold text-xs font-mono">
              20%
            </div>
            <div>
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider leading-none">Metas Futuras</div>
              <div className="text-xs font-semibold text-stone-800">Poupança Livre</div>
            </div>
          </div>

        </div>

      </div>

      {/* Indicador de rolagem */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60">
        <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">Role para explorar</span>
        <ArrowDown className="w-3.5 h-3.5 text-stone-400 animate-bounce" />
      </div>
    </section>
  );
}
