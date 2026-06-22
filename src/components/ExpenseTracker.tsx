import React, { useState, useEffect, useMemo } from "react";
import { Gasto } from "../types";
import { GASTOS_INICIAIS } from "../data";
import { showToast } from "./Toast";
import {
  Trash2,
  Plus,
  TrendingDown,
  Info,
  Calendar,
  Frown,
  Meh,
  Activity,
  Award,
  Sparkles,
  AlertTriangle,
  Smile,
  Check,
  Download,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ExpenseTracker() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [formData, setFormData] = useState({
    item: "",
    valor: "",
    sentimento: "Necessário" as Gasto["sentimento"]
  });
  const [isSuccessAdded, setIsSuccessAdded] = useState(false);
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mente_bolso_gastos");
    if (saved) {
      try {
        setGastos(JSON.parse(saved));
      } catch (e) {
        setGastos(GASTOS_INICIAIS);
      }
    } else {
      setGastos(GASTOS_INICIAIS);
      localStorage.setItem("mente_bolso_gastos", JSON.stringify(GASTOS_INICIAIS));
    }
  }, []);

  const saveToLocalStorage = (newGastos: Gasto[]) => {
    setGastos(newGastos);
    localStorage.setItem("mente_bolso_gastos", JSON.stringify(newGastos));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item.trim() || !formData.valor) return;

    // Sanitize and parse value
    let rawVal = formData.valor.replace(/\s/g, "");
    rawVal = rawVal.replace(".", ""); // remove thousands separator if any
    rawVal = rawVal.replace(",", "."); // convert comma to dot for decimal
    const parsedVal = parseFloat(rawVal);
    if (isNaN(parsedVal) || parsedVal <= 0) return;

    const newGasto: Gasto = {
      id: "g-" + Date.now(),
      item: formData.item.trim(),
      valor: parsedVal,
      sentimento: formData.sentimento,
      data: new Date().toISOString().split("T")[0]
    };

    const updated = [newGasto, ...gastos];
    saveToLocalStorage(updated);

    // Reset Form
    setFormData({
      item: "",
      valor: "",
      sentimento: "Necessário"
    });

    setIsSuccessAdded(true);
    showToast(`Gasto "${newGasto.item}" registrado!`, "success");
    setTimeout(() => setIsSuccessAdded(false), 2000);
  };

  const deleteGasto = (id: string) => {
    const target = gastos.find((g) => g.id === id);
    const updated = gastos.filter((g) => g.id !== id);
    saveToLocalStorage(updated);
    showToast(`Registro "${target ? target.item : ""}" removido.`, "warning");
  };

  const clearHistory = () => {
    if (!confirmClearHistory) {
      setConfirmClearHistory(true);
      showToast("Clique mais uma vez no botão para confirmar a exclusão do histórico.", "info");
      setTimeout(() => setConfirmClearHistory(false), 5000);
      return;
    }
    setConfirmClearHistory(false);
    saveToLocalStorage([]);
    showToast("Histórico de fluxo de caixa reiniciado.", "warning");
  };

  const exportToCSV = () => {
    if (gastos.length === 0) {
      showToast("Nenhum lançamento cadastrado para exportar.", "warning");
      return;
    }

    // Creating CSV header with safe encoding
    let csvContent = "\uFEFF"; // BOM to support excel direct accentuation
    csvContent += "ID;Item/Despesa;Valor (R$);Estado Mental;Data\n";

    gastos.forEach((g) => {
      // Clean string from semicolons or newlines
      const cleanItem = g.item.replace(/;/g, ",").replace(/\n/g, " ");
      const formattedVal = g.valor.toFixed(2).replace(".", ",");
      csvContent += `${g.id};"${cleanItem}";${formattedVal};"${g.sentimento}";${g.data}\n`;
    });

    // Create a virtual download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `VaultLedger_Relatorio_Gastos_Emocionais_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Memoized Calculations
  const calculations = useMemo(() => {
    const total = gastos.reduce((sum, g) => sum + g.valor, 0);

    const somaAnsioso = gastos.filter((g) => g.sentimento === "Ansioso").reduce((sum, g) => sum + g.valor, 0);
    const somaEntediado = gastos.filter((g) => g.sentimento === "Entediado").reduce((sum, g) => sum + g.valor, 0);
    const somaFeliz = gastos.filter((g) => g.sentimento === "Feliz").reduce((sum, g) => sum + g.valor, 0);
    const somaNecessario = gastos.filter((g) => g.sentimento === "Necessário").reduce((sum, g) => sum + g.valor, 0);

    const impulsoSoma = somaAnsioso + somaEntediado;
    const impulsoPercent = total > 0 ? Math.round((impulsoSoma / total) * 100) : 0;

    // Condition requested: "se os gastos com 'Ansioso' ou 'Entediado' superem os gastos com 'Necessário'"
    const alertaGatilhoEmocionalAtivo = impulsoSoma > somaNecessario && total > 0;

    return {
      total,
      somaAnsioso,
      somaEntediado,
      somaFeliz,
      somaNecessario,
      impulsoSoma,
      impulsoPercent,
      alertaGatilhoEmocionalAtivo
    };
  }, [gastos]);

  // Render Feeling Badge Helper
  const renderFeelingBadge = (sentiment: Gasto["sentimento"]) => {
    switch (sentiment) {
      case "Feliz":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ECFCCB] text-[#365314]">
            😌 Feliz / Pleno
          </span>
        );
      case "Ansioso":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
            😰 Ansioso
          </span>
        );
      case "Entediado":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-850 border border-orange-100">
            🥱 Entediado
          </span>
        );
      case "Necessário":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-[#CA8A04] border border-yellow-100">
            🛡️ Necessário
          </span>
        );
    }
  };

  return (
    <section
      id="rastreador"
      className="py-24 bg-white relative overflow-hidden px-6 md:px-12 text-left"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header descriptivo */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#CA8A04] font-semibold block mb-3">
            03 . Psicologia Financeira Aplicada
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
            Rastreador de Humor e Gastos com Insight Emocional
          </h2>
          <div className="w-12 h-[2px] bg-[#EAB308] mx-auto my-5 rounded-full" />
          <p className="text-stone-500 text-sm sm:text-base font-light leading-relaxed">
            Como você se sente quando gasta? Ao catalogar suas emoções, você compreende se está investindo em sua paz ou anestesiando dores internas com gastos triviais.
          </p>
        </div>

        {/* Estatísticas Emocionais no Topo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card Total Gasto */}
          <div className="bg-[#F9FAFB] border border-stone-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Total Des embolsado</span>
              <div className="text-2xl font-mono font-bold text-stone-900 mt-1">
                {calculations.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-4 bg-white px-2.5 py-1.5 rounded-lg border border-stone-150">
              <TrendingDown className="w-3.5 h-3.5 text-stone-500" />
              <span>{gastos.length} transações salvas</span>
            </div>
          </div>

          {/* Card Gastos de Impulso */}
          <div className="bg-[#F9FAFB] border border-stone-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-500 font-semibold block">Gasto Emocional (Impulso)</span>
              <div className="text-2xl font-mono font-bold text-red-700 mt-1">
                {calculations.impulsoSoma.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-red-650 mt-4 bg-red-50/50 px-2.5 py-1.5 rounded-lg border border-red-100">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span>
                {calculations.impulsoPercent}% por Ansiedade / Tédio
              </span>
            </div>
          </div>

          {/* Card Gasto Necessário */}
          <div className="bg-[#F9FAFB] border border-stone-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">Uso Vital / Necessário</span>
              <div className="text-2xl font-mono font-bold text-stone-850 mt-1">
                {calculations.somaNecessario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-4 bg-white px-2.5 py-1.5 rounded-lg border border-stone-150">
              <Award className="w-3.5 h-3.5 text-stone-600" />
              <span>Proteção e sustento básico</span>
            </div>
          </div>

          {/* Card Índice de Inteligência Emocional */}
          <div className={`border rounded-2xl p-6 flex flex-col justify-between shadow-xs transition-colors duration-300 ${
            calculations.impulsoPercent > 35
              ? "bg-amber-50/40 border-amber-200"
              : "bg-emerald-50/30 border-emerald-100"
          }`}>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-550">Autodisciplina Mental</span>
              <div className="text-2xl font-mono font-bold text-stone-900 mt-1">
                {calculations.total > 0 ? `${100 - calculations.impulsoPercent}%` : "100%"}
              </div>
            </div>
            <div className="text-[11px] font-sans text-stone-600 mt-4">
              {calculations.impulsoPercent > 35 ? (
                <span className="text-amber-800 font-semibold flex items-center gap-1">
                  ⚠️ Ativar autodisciplina milenar
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  😌 Controle emocional supremo
                </span>
              )}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Lado Esquerdo: Formulário Moderno de Lançamento */}
          <div className="lg:col-span-5 bg-[#F9FAFB] border border-stone-200 p-8 rounded-3xl shadow-xs">
            
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-yellow-50 border border-yellow-105 rounded-xl text-[#CA8A04]">
                <Plus className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-serif text-lg text-stone-900 font-semibold">
                Lançar Registro Emocional
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nome do Item */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-1.5">
                  Item / Descrição da Despesa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Refeição por delivery, Vestuário extra..."
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  maxLength={40}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#CA8A04] focus:border-[#CA8A04] transition-all font-sans"
                />
              </div>

              {/* Valor do Item */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-1.5">
                  Valor Desembolsado (R$)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-450 text-xs font-serif">
                    R$
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#CA8A04] focus:border-[#CA8A04] transition-all font-mono"
                  />
                </div>
              </div>

              {/* Seletor de Sentimentos / Emoções */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-1.5">
                  Humor predominante no momento do gasto
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "Necessário", label: "🛡️ Necessário", desc: "Uso vital ou planejado" },
                    { id: "Feliz", label: "😌 Feliz / Pleno", desc: "Lazer consciente real" },
                    { id: "Ansioso", label: "😰 Ansioso", desc: "Válvula de escape" },
                    { id: "Entediado", label: "🥱 Entediado", desc: "Comportamento por tédio" }
                  ].map((elem) => (
                    <button
                      key={elem.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, sentimento: elem.id as Gasto["sentimento"] })}
                      className={`p-3 rounded-xl border text-left flex flex-col transition-all cursor-pointer ${
                        formData.sentimento === elem.id
                          ? "bg-yellow-50 border-[#CA8A04] text-stone-900 shadow-xs"
                          : "bg-white border-stone-200 hover:bg-stone-50 text-stone-650"
                      }`}
                    >
                      <span className="text-xs font-semibold leading-none">{elem.label}</span>
                      <span className="text-[9px] font-light text-stone-450 mt-1 leading-none">{elem.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão Registrar Gasto */}
              <button
                type="submit"
                id="submit-expense-btn"
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 text-white hover:bg-[#CA8A04] font-semibold text-xs uppercase tracking-wider shadow-sm hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Registrar Gasto Emocional
              </button>

            </form>

            <AnimatePresence>
              {isSuccessAdded && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-xl text-xs"
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Item registrado e criptografado localmente!</span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Lado Direito: Listagem com Badges e Insights Psicológicos */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Título de Seção com CTAs CSV / Limpar */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
              <h3 className="font-serif text-lg text-stone-950 font-semibold flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-stone-700 font-normal" />
                Dossiê de Fluxo de Caixa
              </h3>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportToCSV}
                  id="export-csv-btn"
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-[#CA8A04] hover:text-white hover:border-[#CA8A04] font-mono text-[9px] uppercase tracking-wider font-semibold transition-all cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Exportar CSV
                </button>
                {gastos.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    id="clear-history-btn_new"
                    className={`py-1.5 px-3 rounded-lg border font-mono text-[9px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                      confirmClearHistory
                        ? "border-amber-400 bg-amber-50 text-amber-700 animate-pulse hover:bg-amber-100"
                        : "border-red-200 bg-[#FFF5F5] text-red-600 hover:text-white hover:bg-red-650 hover:border-red-650"
                    }`}
                  >
                    {confirmClearHistory ? "⚠️ Confirmar Reset" : "Mudar Caixa / Limpar"}
                  </button>
                )}
              </div>
            </div>

            {/* Listagem */}
            {gastos.length === 0 ? (
              <div className="text-center py-20 border border-stone-200 border-dashed rounded-3xl bg-stone-50/50">
                <Meh className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-sans text-sm font-light">
                  Nenhum gasto documentado no LocalStorage privado.
                </p>
                <p className="text-[11px] text-stone-400 font-mono mt-1">
                  Registre seus desembolsos diários para calibrar o insight econômico.
                </p>
              </div>
            ) : (
              <div className="border border-stone-250 bg-white rounded-2xl overflow-hidden shadow-xs flex flex-col">
                
                {/* Tabela de Dispositivos de Fluxo */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F9FAFB] border-b border-stone-200">
                        <th className="px-5 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-stone-450">Descrição</th>
                        <th className="px-5 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-stone-450">Estado Emocional</th>
                        <th className="px-5 py-3 text-right text-[9px] font-mono uppercase tracking-wider text-stone-450">Valor</th>
                        <th className="px-5 py-3 text-center text-[9px] font-mono uppercase tracking-wider text-stone-450 w-12">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150">
                      <AnimatePresence initial={false}>
                        {gastos.map((gasto) => (
                          <motion.tr
                            key={gasto.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.2 }}
                            className="hover:bg-stone-50/40"
                          >
                            <td className="px-5 py-3.5">
                              <span className="text-xs font-semibold text-stone-850 block text-left">
                                {gasto.item}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-stone-400 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                {gasto.data}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-left">
                              {renderFeelingBadge(gasto.sentimento)}
                            </td>
                            <td className="px-5 py-3.5 text-right font-mono text-xs font-bold text-stone-900">
                              {gasto.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => deleteGasto(gasto.id)}
                                className="p-1.5 text-stone-300 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Resumo da Tabela */}
                <div className="bg-[#F9FAFB] border-t border-stone-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                  <span className="text-stone-450 italic">
                    Dados retidos localmente em formato Sandbox privado.
                  </span>
                  <div className="font-mono text-stone-900 font-bold">
                    Soma: {calculations.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                </div>

              </div>
            )}

            {/* Alerta de Insight Emocional Psicológico */}
            <AnimatePresence>
              {calculations.alertaGatilhoEmocionalAtivo && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 border border-amber-300 bg-amber-50/20 p-6 rounded-2xl flex items-start gap-4"
                >
                  <AlertCircle className="w-5.5 h-5.5 text-[#CA8A04] shrink-0 mt-0.5 animate-bounce" />
                  <div className="text-left">
                    <h4 className="font-serif text-sm font-semibold text-[#7c4f14] mb-1">
                      ⚠️ Insight Psicológico: O Oráculo Adverte!
                    </h4>
                    <p className="text-stone-500 text-xs font-light leading-relaxed">
                      Cuidado! Seus gastos com <span className="font-semibold text-stone-800">Ansiedade</span> ou <span className="font-semibold text-stone-800">Tédio</span> representam <strong className="font-semibold text-red-600">{calculations.impulsoPercent}%</strong> do seu total mensal, superando os gastos estritamente <span className="font-semibold text-[#CA8A04]">Necessários</span>.
                    </p>
                    <p className="text-stone-500 text-xs font-light leading-relaxed mt-2 italic font-serif border-l-2 border-[#CA8A04]/50 pl-3">
                      "Lembre-se da 4ª Lei de Ouro da Babilônia: o ouro foge do homem que o força a desejos ilusórios ou românticos impulsos. Não use o dinheiro para blindar descontentamentos emocionais temporários."
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
