import React, { useState, useEffect } from "react";
import { Award, CheckSquare, Square, Zap, RefreshCw, Trophy, Target, ShieldCheck, Flame, Trash2, Plus, PiggyBank, Check, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "./Toast";

interface Hábito {
  id: string;
  tarefa: string;
  pontos: number;
}

interface MetaFinanceira {
  id: string;
  nome: string;
  valorAtual: number;
  valorAlvo: number;
  categoria: string;
}

const HABIT_DEFINITIONS: Hábito[] = [
  { id: "poupe_10", tarefa: "Paguei-me primeiro: separei no mínimo 10% da minha renda diária/mensal", pontos: 30 },
  { id: "gasto_consciente", tarefa: "Controlei as despesas: mantive o padrão e não excedi os limites de luxo", pontos: 20 },
  { id: "evite_impulso", tarefa: "Combati o tédio: resisti e evitei comprar algo apenas por impulso momentâneo", pontos: 25 },
  { id: "leitura_babilonia", tarefa: "Sabedoria: li 10 páginas de livros ou estudei materiais financeiros úteis", pontos: 20 },
  { id: "registro_humor", tarefa: "Rastreamento: lancei todas as despesas diárias com o respectivo sentimento", pontos: 15 }
];

const DEFAULT_METAS: MetaFinanceira[] = [
  { id: "meta_1", nome: "Muralha da Reserva de Emergência", valorAtual: 5000, valorAlvo: 18000, categoria: "Segurança" },
  { id: "meta_2", nome: "Investimentos do Amanhã (Renda Variável)", valorAtual: 2500, valorAlvo: 15000, categoria: "Investimento" },
  { id: "meta_3", nome: "Biblioteca de Saberes Literários", valorAtual: 180, valorAlvo: 500, categoria: "Educação" }
];

export default function Jornada() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [lifetimeXP, setLifetimeXP] = useState<number>(0);
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [completedToday, setCompletedToday] = useState<boolean>(false);

  // States for financial goals
  const [metas, setMetas] = useState<MetaFinanceira[]>([]);
  const [novaMetaNome, setNovaMetaNome] = useState("");
  const [novaMetaAlvo, setNovaMetaAlvo] = useState("");
  const [novaMetaAtual, setNovaMetaAtual] = useState("");
  const [novaMetaCategoria, setNovaMetaCategoria] = useState("Investimento");

  // State to manage inline adjustment/saving of current balance of list items
  const [goalIdAjuste, setGoalIdAjuste] = useState<string | null>(null);
  const [valorAjusteStr, setValorAjusteStr] = useState("");

  // State-based secure confirmation indicators (alternative to blocked iframe native confirm boxes)
  const [confirmLedger, setConfirmLedger] = useState(false);
  const [confirmZerar, setConfirmZerar] = useState(false);

  // Load persistence from localstorage
  useEffect(() => {
    // 1. Load XP
    const savedXP = localStorage.getItem("vault_lifetime_xp");
    if (savedXP) {
      setLifetimeXP(parseInt(savedXP) || 0);
    } else {
      setLifetimeXP(50); // Start with 50 XP as base welcome bonus!
      localStorage.setItem("vault_lifetime_xp", "50");
    }

    // 2. Load checked habits for today (resets on user command or date change)
    const savedChecked = localStorage.getItem("vault_checked_habits");
    if (savedChecked) {
      try {
        setCheckedIds(JSON.parse(savedChecked));
      } catch (e) {
        setCheckedIds([]);
      }
    }

    // 3. Load streak
    const savedStreak = localStorage.getItem("vault_streak_days");
    if (savedStreak) {
      setDailyStreak(parseInt(savedStreak) || 0);
    } else {
      setDailyStreak(1);
      localStorage.setItem("vault_streak_days", "1");
    }

    // 4. Load state check of completion
    const savedCompleted = localStorage.getItem("vault_completed_today_flag");
    if (savedCompleted === "true") {
      setCompletedToday(true);
    }

    // 5. Load Financial Goals
    const savedMetas = localStorage.getItem("vault_finance_goals");
    if (savedMetas) {
      try {
        setMetas(JSON.parse(savedMetas));
      } catch (e) {
        setMetas(DEFAULT_METAS);
      }
    } else {
      setMetas(DEFAULT_METAS);
      localStorage.setItem("vault_finance_goals", JSON.stringify(DEFAULT_METAS));
    }
  }, []);

  // Compute Current Level and Archetype based on XP
  const levelInfo = React.useMemo(() => {
    const xp = lifetimeXP;
    if (xp < 150) {
      return {
        level: 1,
        tit: "Aprendiz das Moedas",
        proximoLevel: 150,
        anteriorLevel: 0,
        desc: "Sua semente de ouro foi plantada. Domine o impulso de consumo inicial!"
      };
    } else if (xp < 400) {
      return {
        level: 2,
        tit: "Cidadão de Babilônia",
        proximoLevel: 400,
        anteriorLevel: 150,
        desc: "Você já se paga primeiro. O ouro começa a encher gradativamente sua carteira."
      };
    } else if (xp < 800) {
      return {
        level: 3,
        tit: "Guardião do Tesouro",
        proximoLevel: 800,
        anteriorLevel: 400,
        desc: "Você protege o seu principal de perdas absurdas e consulta os sábios antes de alocar."
      };
    } else if (xp < 1300) {
      return {
        level: 4,
        tit: "Alquimista do Ouro",
        proximoLevel: 1300,
        anteriorLevel: 800,
        desc: "Seus rendimentos já geram novos frutos. Você aplica a exponencial idade com maestria."
      };
    } else {
      return {
        level: 5,
        tit: "O Homem Mais Rico da Babilônia",
        proximoLevel: 2500, // Elder Cap
        anteriorLevel: 1300,
        desc: "Equilíbrio supremo financeiro e autodescoberta profunda. Seu ouro trabalha indefinidamente!"
      };
    }
  }, [lifetimeXP]);

  const toggleHabit = (id: string, pontos: number) => {
    if (completedToday) {
      showToast("Seu Ledger diário já foi consolidado e registrado por hoje!", "info");
      return;
    }

    let updated: string[];
    if (checkedIds.includes(id)) {
      updated = checkedIds.filter((x) => x !== id);
      showToast(`Hábito desmarcado. (-${pontos} XP temporários)`, "info");
    } else {
      updated = [...checkedIds, id];
      showToast(`Hábito cumprido! de +${pontos} XP`, "success");
    }
    setCheckedIds(updated);
    localStorage.setItem("vault_checked_habits", JSON.stringify(updated));
  };

  // Safe Lock In Ledger
  const consolidarDia = () => {
    if (checkedIds.length === 0) {
      showToast("Marque pelo menos um preceito antes de fechar o dia!", "warning");
      return;
    }

    // Sum points of active session
    const gainedXP = checkedIds.reduce((sum, currentCheckId) => {
      const match = HABIT_DEFINITIONS.find((h) => h.id === currentCheckId);
      return sum + (match ? match.pontos : 0);
    }, 0);

    // Streaks and bonuses
    let streakBonus = 0;
    if (checkedIds.length === HABIT_DEFINITIONS.length) {
      streakBonus = 20; // Perfect day bonus!
    }

    const nLifetimeXP = lifetimeXP + gainedXP + streakBonus;
    const nStreak = dailyStreak + 1;

    setLifetimeXP(nLifetimeXP);
    setDailyStreak(nStreak);
    setCompletedToday(true);

    localStorage.setItem("vault_lifetime_xp", nLifetimeXP.toString());
    localStorage.setItem("vault_streak_days", nStreak.toString());
    localStorage.setItem("vault_completed_today_flag", "true");

    showToast(`Dia Consolidado! +${gainedXP} XP obtidos ${streakBonus > 0 ? " (+20 XP Bônus Perfeito!)" : ""}`, "success");
  };

  const recomecarLedger = () => {
    if (!confirmLedger) {
      setConfirmLedger(true);
      showToast("Clique mais uma vez no botão para confirmar o reset das virtudes diárias.", "info");
      setTimeout(() => setConfirmLedger(false), 5000);
      return;
    }
    setConfirmLedger(false);
    setCheckedIds([]);
    setCompletedToday(false);
    localStorage.setItem("vault_checked_habits", JSON.stringify([]));
    localStorage.setItem("vault_completed_today_flag", "false");
    showToast("Nova rodada de hábitos diários desbloqueada!", "success");
  };

  const zerarProgressoCompleto = () => {
    if (!confirmZerar) {
      setConfirmZerar(true);
      showToast("Atenção! Clique de novo em 'Excluir Conquistas' para resetar todo o seu XP e Classificação.", "warning");
      setTimeout(() => setConfirmZerar(false), 5000);
      return;
    }
    setConfirmZerar(false);
    setLifetimeXP(50);
    setDailyStreak(1);
    setCheckedIds([]);
    setCompletedToday(false);
    localStorage.setItem("vault_lifetime_xp", "50");
    localStorage.setItem("vault_streak_days", "1");
    localStorage.setItem("vault_checked_habits", JSON.stringify([]));
    localStorage.setItem("vault_completed_today_flag", "false");
    showToast("Toda a sua jornada de XP foi resetada com sucesso.", "warning");
  };

  // Metas financeiras event handlers
  const adicionarMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMetaNome.trim()) {
      showToast("Por favor, dê um nome à sua meta financeira.", "warning");
      return;
    }
    const alvo = parseFloat(novaMetaAlvo);
    if (isNaN(alvo) || alvo <= 0) {
      showToast("Defina um valor alvo de economia válido e maior que zero.", "warning");
      return;
    }
    const atual = parseFloat(novaMetaAtual || "0");
    const novaMeta: MetaFinanceira = {
      id: "meta_" + Date.now(),
      nome: novaMetaNome.trim(),
      valorAtual: isNaN(atual) || atual < 0 ? 0 : atual,
      valorAlvo: alvo,
      categoria: novaMetaCategoria
    };

    const updated = [...metas, novaMeta];
    setMetas(updated);
    localStorage.setItem("vault_finance_goals", JSON.stringify(updated));
    showToast(`Meta "${novaMeta.nome}" adicionada à sua jornada!`, "success");

    // Limpar campos
    setNovaMetaNome("");
    setNovaMetaAlvo("");
    setNovaMetaAtual("");
    setNovaMetaCategoria("Investimento");
  };

  const excluirMeta = (id: string) => {
    const target = metas.find((m) => m.id === id);
    const updated = metas.filter((m) => m.id !== id);
    setMetas(updated);
    localStorage.setItem("vault_finance_goals", JSON.stringify(updated));
    showToast(`Meta "${target ? target.nome : ""}" foi removida.`, "warning");
  };

  const ajustarValorAtual = (id: string, novoValor: number) => {
    const updated = metas.map((m) => {
      if (m.id === id) {
        const val = Math.max(0, novoValor);
        if (val >= m.valorAlvo) {
          showToast(`🏆 Incrível! Você atingiu ou superou a meta "${m.nome}"!`, "success");
        }
        return { ...m, valorAtual: val };
      }
      return m;
    });
    setMetas(updated);
    localStorage.setItem("vault_finance_goals", JSON.stringify(updated));
  };

  const incrementarRapido = (id: string, quantia: number) => {
    const target = metas.find((m) => m.id === id);
    if (!target) return;
    const novoValor = target.valorAtual + quantia;
    ajustarValorAtual(id, novoValor);
    showToast(`Adicionado ${quantia.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })} em "${target.nome}".`, "success");
  };

  const iniciarEdicaoValor = (meta: MetaFinanceira) => {
    setGoalIdAjuste(meta.id);
    setValorAjusteStr(meta.valorAtual.toString());
  };

  const salvarEdicaoValor = (id: string) => {
    const novoVal = parseFloat(valorAjusteStr);
    if (isNaN(novoVal) || novoVal < 0) {
      showToast("Insira um valor válido de saldo.", "warning");
      return;
    }
    ajustarValorAtual(id, novoVal);
    setGoalIdAjuste(null);
    setValorAjusteStr("");
    showToast("Saldo atualizado com sucesso!", "success");
  };

  // XP calculations for UI slider
  const relativeXP = lifetimeXP - levelInfo.anteriorLevel;
  const relativeTarget = levelInfo.proximoLevel - levelInfo.anteriorLevel;
  const percentXP = Math.min(100, Math.max(0, Math.round((relativeXP / relativeTarget) * 100)));

  return (
    <section id="jornada" className="py-24 bg-white border-b border-stone-200/50 px-6 md:px-12 text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* Title Presentation */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#CA8A04] font-semibold block mb-3">
            06 . Medalheiro e Autodisciplina
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
            Jornada da Riqueza: Rito e Comportamento
          </h2>
          <div className="w-12 h-[2px] bg-[#EAB308] mx-auto my-5 rounded-full" />
          <p className="text-stone-500 text-sm sm:text-base font-light leading-relaxed">
            As finanças saudáveis não são apenas cálculos frios, mas a repetição diária de hábitos de ouro estáticos. Controle seu modelo mental para progredir sua linhagem na antiga Babilônia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Lado Esquerdo: Checklist de Hábitos */}
          <div className="lg:col-span-7 bg-[#F9FAFB] border border-stone-200 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-stone-200/60 mb-6">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#CA8A04]" />
                  <h3 className="font-serif text-base text-stone-900 font-semibold mb-0">
                    Ledger de Virtudes Diárias
                  </h3>
                </div>
                {completedToday ? (
                  <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-50 text-[#15803d] border border-emerald-100 py-1 px-3 rounded-full font-bold">
                    Consolidado
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-mono tracking-wider bg-yellow-50 text-[#CA8A04] border border-yellow-100 py-1 px-3 rounded-full font-bold">
                    Nova Rodada Ativa
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-500 font-light leading-relaxed mb-6">
                Marque abaixo quais preceitos você respeitou ou implementou com maestria hoje e converta virtude em pontos de sabedoria mental.
              </p>

              {/* Checklist Blocks with dynamic layout */}
              <div className="space-y-3 mb-8">
                {HABIT_DEFINITIONS.map((habit) => {
                  const isChecked = checkedIds.includes(habit.id);
                  return (
                    <button
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id, habit.pontos)}
                      disabled={completedToday}
                      className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all ${
                        completedToday ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                      } ${
                        isChecked
                          ? "bg-white border-[#CA8A04] shadow-xs"
                          : "bg-white border-stone-200 hover:border-stone-350"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isChecked ? (
                          <div className="w-5 h-5 rounded-md bg-[#CA8A04] flex items-center justify-center text-white">
                            <span className="text-xs font-bold font-mono">✓</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md border border-stone-300 bg-stone-50" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`text-xs font-semibold ${isChecked ? "text-stone-900" : "text-stone-700 font-medium"}`}>
                          {habit.tarefa}
                        </p>
                        <span className="inline-block text-[9px] uppercase font-mono text-[#CA8A04] font-extrabold mt-1">
                          +{habit.pontos} XP de Sabedoria
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form actions and stats integration */}
            <div className="pt-6 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={consolidarDia}
                disabled={completedToday}
                id="consolidate-today-btn"
                className={`py-3 px-5 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono transition-all cursor-pointer ${
                  completedToday
                    ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                    : "bg-stone-950 hover:bg-[#CA8A04] text-white hover:scale-[1.02] active:scale-95"
                }`}
              >
                Consolidar Virtudes de Hoje
              </button>

              <div className="flex gap-2">
                <button
                  onClick={recomecarLedger}
                  id="reset-ledger-btn"
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    confirmLedger
                      ? "border-amber-300 bg-amber-50 text-amber-700 animate-pulse"
                      : "border-stone-250 bg-white hover:bg-stone-150 text-stone-600"
                  }`}
                  title="Abrir Nova Rodada Diária"
                >
                  <RefreshCw className={`w-4 h-4 ${confirmLedger ? "animate-spin" : ""}`} />
                  {confirmLedger && <span className="text-[10px] font-mono font-bold">Nova Rodada?</span>}
                </button>
              </div>
            </div>

          </div>

          {/* Lado Direito: Perfil de Sabedoria e níveis (Progresso de Archetypes) */}
          <div className="lg:col-span-5 bg-white border border-stone-200 p-8 rounded-3xl flex flex-col justify-between">
            
            <div className="text-left space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-stone-150">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#CA8A04]" />
                  <h3 className="font-serif text-base text-stone-900 font-bold">
                    Classificação Social
                  </h3>
                </div>
                
                <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 text-[#CA8A04] font-bold text-xs uppercase font-mono px-3 py-1 rounded-full">
                  <Flame className="w-3.5 h-3.5 fill-[#CA8A04] animate-bounce" />
                  <span>{dailyStreak} Dias Ativos</span>
                </div>
              </div>

              {/* Big Archetype Profile Badge */}
              <div className="p-6 bg-gradient-to-tr from-stone-900 to-stone-955 text-white rounded-2xl relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full filter blur-xl" />
                <span className="text-[9px] uppercase font-mono text-stone-450 tracking-widest block font-bold">Archetype Atual</span>
                
                <h4 className="font-serif text-xl font-bold text-amber-400 mt-1 leading-snug">
                  {levelInfo.tit}
                </h4>
                
                <span className="inline-block mt-2 text-[10px] font-mono uppercase bg-amber-500/10 text-stone-300 border border-amber-500/20 px-2.5 py-0.5 rounded font-semibold">
                  Nível {levelInfo.level}
                </span>

                <p className="text-stone-400 text-xs font-light leading-relaxed mt-4 leading-normal">
                  {levelInfo.desc}
                </p>
              </div>

              {/* Progress dynamic bar slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase text-stone-450">
                  <span>Próxima Patente</span>
                  <span className="font-bold text-stone-700">{lifetimeXP} / {levelInfo.proximoLevel} XP Total</span>
                </div>

                <div className="w-full h-3 bg-stone-100 border border-stone-200 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-[#EAB308] to-[#CA8A04] transition-all duration-500 rounded-full"
                    style={{ width: `${percentXP}%` }}
                  />
                </div>

                <div className="flex justify-between text-[9px] text-[#CA8A04] font-semibold">
                  <span>Nível {levelInfo.level}</span>
                  <span>Faltam {levelInfo.proximoLevel - lifetimeXP} XP para subir</span>
                </div>
              </div>

            </div>

            {/* Danger fully refresh reset */}
            <div className="pt-6 border-t border-stone-100 mt-8 lg:mt-0">
              <button
                onClick={zerarProgressoCompleto}
                id="hard-reset-experience-btn"
                className={`text-[9px] font-mono uppercase font-bold transition-all bg-transparent border-0 cursor-pointer flex items-center gap-1.5 ${
                  confirmZerar
                    ? "text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg animate-pulse"
                    : "text-stone-400 hover:text-red-500"
                }`}
              >
                {confirmZerar ? "⚠️ Clique de Novo para Excluir Conquistas" : "⚠️ Renunciar Conquistas de Arcádia (Reset)"}
              </button>
            </div>

          </div>

        </div>

        {/* Divider separator */}
        <div className="w-full h-[1px] bg-stone-200/60 my-16" />

        {/* FINANCIAL GOALS TRACKER SECTION CONTAINER */}
        <div className="space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/50 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-[#CA8A04]" />
                <h3 className="font-serif text-xl text-stone-900 font-semibold mb-0">
                  Metas de Estabilidade e Crescimento
                </h3>
              </div>
              <p className="text-xs text-stone-500 font-light max-w-2xl leading-relaxed mt-1">
                Estipule objetivos de longo prazo (como investimentos, reservas protetoras ou saberes intelectuais). Poupe com constância e acompanhe o progresso percentual acumulado de cada conquista.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* COLUMN 1: Form to Add Goal */}
            <div className="lg:col-span-4 bg-[#F9FAFB] border border-stone-205 p-8 rounded-3xl">
              <h4 className="font-serif text-sm text-stone-900 font-bold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#CA8A04]" />
                Nova Meta Financeira
              </h4>
              
              <form onSubmit={adicionarMeta} className="space-y-4">
                {/* Name field */}
                <div className="space-y-1">
                  <label htmlFor="meta_nome_input" className="block text-[10px] font-mono uppercase text-stone-500 font-bold">
                    Nome do Objetivo
                  </label>
                  <input
                    id="meta_nome_input"
                    type="text"
                    required
                    placeholder="Ex: Reserva Protetora, Livros..."
                    value={novaMetaNome}
                    onChange={(e) => setNovaMetaNome(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-sans text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                  />
                </div>

                {/* Grid Inputs for Target & Saved initial */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="meta_alvo_input" className="block text-[10px] font-mono uppercase text-stone-500 font-bold">
                      Valor Alvo (R$)
                    </label>
                    <input
                      id="meta_alvo_input"
                      type="number"
                      required
                      min="1"
                      placeholder="Ex: 5000"
                      value={novaMetaAlvo}
                      onChange={(e) => setNovaMetaAlvo(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="meta_atual_input" className="block text-[10px] font-mono uppercase text-stone-500 font-bold">
                      Valor Atual (R$)
                    </label>
                    <input
                      id="meta_atual_input"
                      type="number"
                      min="0"
                      placeholder="Ex: 500"
                      value={novaMetaAtual}
                      onChange={(e) => setNovaMetaAtual(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                    />
                  </div>
                </div>

                {/* Category selector */}
                <div className="space-y-1">
                  <label htmlFor="meta_cat_select" className="block text-[10px] font-mono uppercase text-stone-500 font-bold">
                    Categoria
                  </label>
                  <select
                    id="meta_cat_select"
                    value={novaMetaCategoria}
                    onChange={(e) => setNovaMetaCategoria(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-sans text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                  >
                    <option value="Segurança">Segurança (Reserva de Emergência)</option>
                    <option value="Investimento">Investimento (Renda Passiva)</option>
                    <option value="Educação">Educação (Livros / Sabedoria)</option>
                    <option value="Lazer">Lazer & Prazer (Viagens / Hobbies)</option>
                    <option value="Bens de Valor">Grandes Bens (Casa / Eletrônicos)</option>
                  </select>
                </div>

                {/* Form CTA */}
                <button
                  type="submit"
                  id="add-financial-goal-submit-btn"
                  className="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-[#CA8A04] text-white text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Cadastrar Objetivo
                </button>
              </form>
            </div>

            {/* COLUMN 2: Goals list */}
            <div className="lg:col-span-8">
              {metas.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-dashed border-stone-200 bg-stone-50/50">
                  <PiggyBank className="w-8 h-8 text-stone-400 mx-auto mb-3" />
                  <p className="text-stone-700 text-xs font-semibold mb-1">Nenhuma meta estipulada ainda</p>
                  <p className="text-stone-500 text-[11px] font-light">Defina objetivos no formulário ao lado para iniciar seu acompanhamento financeiro.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {metas.map((meta) => {
                    const percent = meta.valorAlvo > 0 ? Math.min(100, Math.round((meta.valorAtual / meta.valorAlvo) * 100)) : 0;
                    const formatCurrencyVal = (val: number) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
                    const isEditing = goalIdAjuste === meta.id;

                    return (
                      <div
                        key={meta.id}
                        className="bg-white border border-stone-200 hover:border-stone-300 p-5 rounded-2x flex flex-col justify-between transition-shadow duration-300 shadow-xs relative rounded-2xl"
                      >
                        {/* Upper row: Categoria & Trash delete */}
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-[9px] uppercase font-mono px-2.5 py-0.5 rounded-md font-bold tracking-wider ${
                            meta.categoria === "Segurança" ? "bg-red-50 text-red-700 border border-red-100" :
                            meta.categoria === "Investimento" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            meta.categoria === "Educação" ? "bg-amber-50 text-[#CA8A04] border border-amber-100" :
                            meta.categoria === "Lazer" ? "bg-sky-50 text-sky-700 border border-sky-100" : "bg-stone-100 text-stone-700 border border-stone-200"
                          }`}>
                            {meta.categoria}
                          </span>

                          <button
                            onClick={() => excluirMeta(meta.id)}
                            className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors"
                            title="Remover meta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title and stats layout */}
                        <div className="mb-4">
                          <h5 className="font-serif text-sm font-semibold text-stone-900 leading-snug mb-1 text-left">
                            {meta.nome}
                          </h5>
                          
                          {/* Remaining metrics badge */}
                          <p className="text-[10px] text-stone-500 font-light mb-4 text-left">
                            {meta.valorAtual >= meta.valorAlvo ? (
                              <span className="text-[#15803d] font-semibold">🎉 Objetivo atingido com mérito!</span>
                            ) : (
                              <span>Faltam <strong className="font-semibold text-stone-700">{formatCurrencyVal(meta.valorAlvo - meta.valorAtual)}</strong> para poupar.</span>
                            )}
                          </p>

                          {/* Progress slider bar representation */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-end text-xs font-mono">
                              <span className="text-stone-400 text-[10px]">{formatCurrencyVal(meta.valorAtual)}</span>
                              <span className="text-[#CA8A04] font-extrabold text-sm">{percent}%</span>
                              <span className="text-stone-700 text-[10px] font-bold">{formatCurrencyVal(meta.valorAlvo)}</span>
                            </div>

                            <div className="w-full h-2 bg-stone-100 border border-stone-200/80 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-[#CA8A04] transition-all duration-300 rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Balance adjustment control actions */}
                        <div className="pt-4 border-t border-stone-100/80 mt-auto">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                required
                                min="0"
                                value={valorAjusteStr}
                                onChange={(e) => setValorAjusteStr(e.target.value)}
                                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-mono text-stone-900 bg-stone-50 focus:outline-none"
                              />
                              <button
                                onClick={() => salvarEdicaoValor(meta.id)}
                                className="p-1.5 bg-stone-900 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                                title="Salvar"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              {/* Quick edit inline triggers */}
                              <button
                                onClick={() => iniciarEdicaoValor(meta)}
                                className="text-[10px] font-mono text-stone-500 hover:text-stone-900 underline bg-transparent border-0 cursor-pointer font-semibold"
                              >
                                Ajustar Saldo
                              </button>

                              {/* Increments buttons */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => incrementarRapido(meta.id, 100)}
                                  className="text-[9px] font-mono font-bold bg-stone-50 hover:bg-[#CA8A04] hover:text-white text-stone-500 border border-stone-200 px-1.5 py-1 rounded transition-all cursor-pointer"
                                  title="Adicionar 100 moedas"
                                >
                                  +R$ 100
                                </button>
                                <button
                                  onClick={() => incrementarRapido(meta.id, 500)}
                                  className="text-[9px] font-mono font-bold bg-stone-50 hover:bg-[#CA8A04] hover:text-white text-stone-500 border border-stone-200 px-1.5 py-1 rounded transition-all cursor-pointer"
                                  title="Adicionar 500 moedas"
                                >
                                  +R$ 500
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
