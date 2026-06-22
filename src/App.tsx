import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Affirmations from "./components/Affirmations";
import BudgetCalculator from "./components/BudgetCalculator";
import ExpenseTracker from "./components/ExpenseTracker";
import Alquimista from "./components/Alquimista";
import Biblioteca from "./components/Biblioteca";
import Jornada from "./components/Jornada";
import Escudo from "./components/Escudo";
import ReportPrinter from "./components/ReportPrinter";
import { ToastContainer } from "./components/Toast";
import { Coins, Heart, FileText, ArrowUp, Compass, Anchor, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll to update active nav link and scroll-to-top button
  useEffect(() => {
    const sections = ["hero", "mentalidade", "calculadora", "rastreador", "alquimista", "biblioteca", "jornada", "escudo"];
    
    const handleScroll = () => {
      // Toggle scroll to top button
      setShowScrollTop(window.scrollY > 400);

      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen text-stone-800 font-sans selection:bg-amber-200 selection:text-stone-900 overflow-x-hidden">
      
      {/* Dynamic Header / Navbar */}
      <Navbar activeSection={activeSection} />

      {/* Global Toast Notifications Container */}
      <ToastContainer />

      {/* Hero Header Presentation */}
      <main className="relative">
        <Hero />
        
        {/* Affirmations Section */}
        <Affirmations />

        {/* 50/30/20 Calculator Section */}
        <BudgetCalculator />

        {/* Expenses and Sentiment Tracker Section */}
        <ExpenseTracker />

        {/* Alquimista/Exponentials Section */}
        <Alquimista />

        {/* Biblioteca de Babilônia Section */}
        <Biblioteca />

        {/* Jornada / Experience Section */}
        <Jornada />

        {/* O Escudo / Emergency Cushion Section */}
        <Escudo />

        {/* Printable PDF Report Banner Action */}
        <div className="py-20 bg-stone-50 text-center border-b border-stone-200/50 flex flex-col items-center justify-center">
          <div className="max-w-xl px-6 flex flex-col items-center">
            <h3 className="font-serif text-2xl text-stone-900 font-medium tracking-tight mb-2">
              Dossiê e Orçamento Consolidado
            </h3>
            <p className="text-stone-500 text-sm font-light leading-relaxed mb-8 max-w-md">
              Gere uma folha de orçamento de alta resolução no formato PDF imprimível com toda a sua sabidoria fiduciária calculada em nosso sistema.
            </p>
            <ReportPrinter />
          </div>
        </div>
      </main>

      {/* Modern Minimalist Editorial Footer */}
      <footer className="bg-stone-950 text-stone-400 py-16 px-6 md:px-12 border-t border-stone-850">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Col 1: Brand Philosophy */}
          <div className="md:col-span-5 text-left">
            <span className="font-serif text-white font-medium text-2xl tracking-tight flex items-center gap-2 mb-4">
              VaultLedger
            </span>
            <p className="text-stone-500 text-xs font-light leading-relaxed mb-6 max-w-sm">
              Um conceito unificado idealizado para desmistificar a crença de que a economia rigorosa reside em ansiedade contínua. Alinhe suas cognições, conheça suas despesas e habite sua liberdade de tempo hoje.
            </p>
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-semibold">
              Elegância · Autonomia · Consciência
            </span>
          </div>

          {/* Col 2: Methodological Details */}
          <div className="md:col-span-4 text-left">
            <h4 className="font-mono text-xs uppercase tracking-widest text-stone-200 font-semibold mb-4">
              Princípios da Casa
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-500">
              <li className="hover:text-stone-300 transition-colors">
                • <strong>Paz com o Consumo</strong>: Comprar para suprir necessidades, nunca vazios.
              </li>
              <li className="hover:text-stone-300 transition-colors">
                • <strong>O Poder do Espaço</strong>: Deixar margens confortáveis no caixa mensal.
              </li>
              <li className="hover:text-stone-300 transition-colors">
                • <strong>Autoanálise Constante</strong>: Monitorar o humor de cada centavo gasto.
              </li>
              <li className="hover:text-stone-300 transition-colors">
                • <strong>Regulação Automática</strong>: 50% Presente, 30% Conforto, 20% Futuro.
              </li>
            </ul>
          </div>

          {/* Col 3: Technical Integrity */}
          <div className="md:col-span-3 text-left">
            <h4 className="font-mono text-xs uppercase tracking-widest text-stone-200 font-semibold mb-4">
              Integridade do Usuário
            </h4>
            <p className="text-stone-500 text-xs font-light leading-relaxed mb-4">
              Sua privacidade é inviolável. Este aplicativo não envia nada a servidores terceiros; toda a retenção do seu histórico de transações e metas é armazenada localmente em sua sandbox web privada.
            </p>
            <div className="flex gap-4 text-[10px] font-mono text-stone-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                100% Offline
              </span>
              <span>•</span>
              <span>Sem Cookies Ativos</span>
            </div>
          </div>

        </div>

        {/* Footer Base License */}
        <div className="max-w-6xl mx-auto pt-10 mt-10 border-t border-stone-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-stone-600 font-light font-mono text-[10px]">
            &copy; {new Date().getFullYear()} VaultLedger. Todos os direitos reservados. Projetado para Estabilidade Mental.
          </p>
          <div className="flex items-center gap-4 text-stone-650 font-mono text-[10px]">
            <span>Estilo Premium Minimalist</span>
            <span>v1.2.0</span>
          </div>
        </div>
      </footer>

      {/* Floating Scroll Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            id="scroll-to-top-btn"
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-50 p-3.5 bg-stone-900 border border-stone-850 rounded-full text-white shadow-xl hover:bg-amber-400 hover:text-stone-900 transition-all cursor-pointer"
          >
            <ArrowUp className="w-4.5 h-4.5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}

