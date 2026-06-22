import React, { useState, useMemo } from "react";
import { Shield, ShieldAlert, ShieldCheck, Landmark, Anchor, HelpCircle, FileText, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "./Toast";

// stability types
type ProfessionalStability = "servidor" | "clt_autonomo";

export default function Escudo() {
  const [stabilidade, setStabilidade] = useState<ProfessionalStability>("clt_autonomo");
  const [custoMensal, setCustoMensal] = useState<number>(3000);
  const [mesesDesejados, setMesesDesejados] = useState<number>(6);
  const [saldoSalvo, setSaldoSalvo] = useState<number>(5000);

  // Load from local storage on mount
  React.useEffect(() => {
    const savedStabilidade = localStorage.getItem("vault_regime_estabilidade") as ProfessionalStability;
    const savedCusto = localStorage.getItem("vault_custo_mensal");
    const savedMeses = localStorage.getItem("vault_meses_desejados");
    const savedSaldo = localStorage.getItem("vault_saldo_salvo");

    if (savedStabilidade) setStabilidade(savedStabilidade);
    if (savedCusto) setCustoMensal(parseFloat(savedCusto) || 3000);
    if (savedMeses) setMesesDesejados(parseInt(savedMeses) || 6);
    if (savedSaldo) setSaldoSalvo(parseFloat(savedSaldo) || 5000);
  }, []);

  // Save changes to local storage
  React.useEffect(() => {
    localStorage.setItem("vault_regime_estabilidade", stabilidade);
  }, [stabilidade]);

  React.useEffect(() => {
    localStorage.setItem("vault_custo_mensal", custoMensal.toString());
  }, [custoMensal]);

  React.useEffect(() => {
    localStorage.setItem("vault_meses_desejados", mesesDesejados.toString());
  }, [mesesDesejados]);

  React.useEffect(() => {
    localStorage.setItem("vault_saldo_salvo", saldoSalvo.toString());
  }, [saldoSalvo]);

  // Suggested months based on stability selected
  const suggestedMonths = useMemo(() => {
    return stabilidade === "servidor" ? { min: 3, max: 6, def: 6 } : { min: 6, max: 12, def: 12 };
  }, [stabilidade]);

  // Adjust months if current months exceed suggestion bounds when stability changes
  const handleStabilityChange = (type: ProfessionalStability) => {
    setStabilidade(type);
    if (type === "servidor") {
      setMesesDesejados(6);
      showToast("Estabilidade Servidor: recomendação de 3 a 6 meses de segurança.", "success");
    } else {
      setMesesDesejados(12);
      showToast("Estabilidade CLT/Autônomo: recomendação de 6 a 12 meses de segurança.", "success");
    }
  };

  // Target Reserve Formula
  const alvoReserva = useMemo(() => {
    return custoMensal * mesesDesejados;
  }, [custoMensal, mesesDesejados]);

  // Protection Percentage
  const porcentagemProtecao = useMemo(() => {
    if (alvoReserva <= 0) return 100;
    const pct = Math.round((saldoSalvo / alvoReserva) * 100);
    return Math.min(100, Math.max(0, pct));
  }, [saldoSalvo, alvoReserva]);

  // Status message determined by protective percentage
  const statusFortressMessage = useMemo(() => {
    const pct = porcentagemProtecao;
    if (pct === 0) {
      return {
        tit: "Fortaleza Inexistente",
        desc: "Sua habitação está indefesa. Qualquer tempestade forçará você a contrair novas dívidas de juros usurários.",
        color: "text-red-650 bg-red-50 border-red-150"
      };
    } else if (pct < 30) {
      return {
        tit: "Pequena Trincheira",
        desc: "Você ergueu os primeiros tijolos. Há pouca proteção contra imprevistos complexos, persista na acumulação.",
        color: "text-amber-700 bg-amber-50/55 border-amber-200"
      };
    } else if (pct < 70) {
      return {
        tit: "Muralha em Construção",
        desc: "Sua barreira de segurança já desvia problemas corriqueiros. Seu caixa tem fluxo para suportar pequenas urgências.",
        color: "text-[#CA8A04] bg-[#fdfded] border-yellow-200"
      };
    } else if (pct < 100) {
      return {
        tit: "Cidadela de Ferro",
        desc: "Uma segurança robusta protege seu sono. Seus credores não batem à sua porta pois sabem de sua solvência parcial.",
        color: "text-emerald-700 bg-emerald-50/50 border-emerald-150"
      };
    } else {
      return {
        tit: "Fortaleza Impenetrável",
        desc: "Defesa absoluta atingida! Você conquistou sua alforria provisória e estabilidade civil contra as intempéries econômicas.",
        color: "text-emerald-800 bg-[#EFE] border-emerald-300"
      };
    }
  }, [porcentagemProtecao]);

  const formatBRL = (val: number) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    });
  };

  return (
    <section id="escudo" className="py-24 bg-[#F9FAFB] border-b border-stone-200/50 px-6 md:px-12 text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* Title Presentation */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#CA8A04] font-semibold block mb-3">
            07 . A Muralha Protetora
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
            O Escudo: Planejador de Reserva de Emergência
          </h2>
          <div className="w-12 h-[2px] bg-[#EAB308] mx-auto my-5 rounded-full" />
          <p className="text-stone-500 text-sm sm:text-base font-light leading-relaxed">
            "A segurança deve ser seu lema: não arrisque sem garantias sólidas." Erga uma barreira de liquidez imediata para defender seu lar e reter sua dignidade contra imprevistos repentinos.
          </p>
        </div>

        {/* Core Escudo Dashboard layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left columns: Form configuration */}
          <div className="lg:col-span-7 bg-white border border-stone-200 p-8 rounded-3xl space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-150 mb-4">
                <div className="p-2 bg-yellow-50 border border-yellow-100 rounded-xl text-[#CA8A04]">
                  <Anchor className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-serif text-base text-stone-950 font-bold mb-0">
                  Calibrar Parâmetros de Estabilidade
                </h3>
              </div>

              {/* Stability selectors */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest text-stone-500 mb-2">
                  Regime Profissional Atual
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStabilityChange("servidor")}
                    type="button"
                    className={`p-4 rounded-xl border text-left flex flex-col cursor-pointer transition-all ${
                      stabilidade === "servidor"
                        ? "bg-yellow-50 border-[#CA8A04] text-stone-900"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100/50 text-stone-600"
                    }`}
                  >
                    <span className="text-xs font-semibold">🏛️ Servidor Público</span>
                    <span className="text-[9px] font-light text-stone-450 mt-1">Estabilidade alta (reserva de 3 a 6 meses de custo)</span>
                  </button>

                  <button
                    onClick={() => handleStabilityChange("clt_autonomo")}
                    type="button"
                    className={`p-4 rounded-xl border text-left flex flex-col cursor-pointer transition-all ${
                      stabilidade === "clt_autonomo"
                        ? "bg-yellow-50 border-[#CA8A04] text-stone-900"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100/50 text-stone-600"
                    }`}
                  >
                    <span className="text-xs font-semibold">💼 Autônomo ou CLT</span>
                    <span className="text-[9px] font-light text-stone-450 mt-1">Estabilidade dinâmica (reserva de 6 a 12 meses)</span>
                  </button>
                </div>
              </div>

              {/* Monthly Cost in BRL input */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest text-stone-500 mb-1.5 flex justify-between">
                  <span>Custo Vital Mensal Desejado</span>
                  <span className="font-mono text-[#CA8A04] font-bold">{formatBRL(custoMensal)}</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 text-xs font-serif">R$</span>
                  <input
                    type="number"
                    min="1"
                    max="500000"
                    value={custoMensal}
                    onChange={(e) => setCustoMensal(Math.max(100, parseInt(e.target.value) || 0))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                  />
                </div>
              </div>

              {/* Target timeframe in Months */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest text-stone-500 mb-1.5 flex justify-between">
                  <span>Meses Isolados Desejados (Isolamento Financeiro)</span>
                  <span className="font-mono text-stone-850 font-bold">{mesesDesejados} Meses</span>
                </label>
                <input
                  type="range"
                  min={suggestedMonths.min}
                  max={suggestedMonths.max}
                  step="1"
                  value={mesesDesejados}
                  onChange={(e) => setMesesDesejados(parseInt(e.target.value))}
                  className="w-full h-1 bg-stone-150 rounded-lg appearance-none cursor-pointer accent-[#CA8A04] leading-none"
                />
                <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-1">
                  <span>Mínimo Recomendado: {suggestedMonths.min} meses</span>
                  <span>Máximo: {suggestedMonths.max} meses</span>
                </div>
              </div>

              {/* Current Savings Input */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-stone-500 mb-1.5 flex justify-between">
                  <span>Montante Já Acumulado Específico para Reserva</span>
                  <span className="font-mono font-bold text-emerald-600">{formatBRL(saldoSalvo)}</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 text-xs font-serif">R$</span>
                  <input
                    type="number"
                    min="0"
                    max="5000000"
                    value={saldoSalvo}
                    onChange={(e) => setSaldoSalvo(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-55 text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                  />
                </div>
              </div>

            </div>

            {/* Quick adjust helper for user */}
            <div className="pt-4 border-t border-stone-100">
              <span className="block text-[9px] uppercase font-mono tracking-widest text-stone-400 mb-2">Ajuste Rápido de Saldo Salvo</span>
              <div className="flex gap-2">
                {[0, 2500, 5000, 15000, 30000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setSaldoSalvo(val);
                      showToast(`Saldo calibrado: ${formatBRL(val)}`, "success");
                    }}
                    className={`flex-1 py-1 px-2 border rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      saldoSalvo === val
                        ? "bg-stone-900 text-white border-stone-950"
                        : "bg-white text-stone-650 hover:bg-stone-50"
                    }`}
                  >
                    R$ {val >= 1000 ? `${val/1000}k` : val}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right columns: Visual Thermometer vertical and fortress states */}
          <div className="lg:col-span-5 bg-white border border-stone-200 p-8 rounded-3xl grid grid-cols-12 gap-6 items-center">
            
            {/* Left Thermometer section */}
            <div className="col-span-4 flex flex-col items-center justify-center">
              
              <span className="text-[9px] uppercase font-mono tracking-widest text-stone-450 mb-3 text-center">Proteção</span>

              {/* Vertical Thermometer shell */}
              <div className="h-[220px] w-6 bg-stone-100 rounded-full border border-stone-200 flex flex-col justify-end p-0.5 relative">
                
                {/* Dynamically sliding filled yellow state */}
                <motion.div
                  className="w-full bg-[#CA8A04] rounded-full transition-all duration-500 ease-out flex items-center justify-center relative min-h-[6px]"
                  style={{ height: `${porcentagemProtecao}%` }}
                >
                  {/* Subtle shine background asset on thermometers */}
                  <div className="absolute inset-0 bg-white/10" />
                </motion.div>
                
                {/* Visual marker lines */}
                <div className="absolute top-1/4 right-0 w-2 h-[1px] bg-stone-300" title="25% Target" />
                <div className="absolute top-1/2 right-0 w-2 h-[1px] bg-stone-300" title="50% Target" />
                <div className="absolute top-3/4 right-0 w-2 h-[1px] bg-stone-300" title="75% Target" />

              </div>

              <span className="font-mono text-xs font-extrabold text-stone-900 mt-3 block">
                {porcentagemProtecao}%
              </span>

            </div>

            {/* Right text fortress states section */}
            <div className="col-span-8 flex flex-col h-full justify-between py-2 text-left space-y-6">
              
              <div className="space-y-4">
                
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#CA8A04] font-bold block">Status do Colchão</span>
                  <div className="text-xl font-serif text-stone-950 font-semibold mt-1">
                    {formatBRL(saldoSalvo)} / <span className="text-sm font-sans font-light text-stone-450">{formatBRL(alvoReserva)}</span>
                  </div>
                </div>

                {/* State Alert Box dynamic */}
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed font-sans ${statusFortressMessage.color}`}>
                  <strong className="block font-semibold mb-1 uppercase font-mono text-[10px] tracking-wide">
                    🏛️ {statusFortressMessage.tit}
                  </strong>
                  {statusFortressMessage.desc}
                </div>

              </div>

              {/* Fortress description context */}
              <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-450 leading-relaxed font-light">
                <ShieldCheck className="w-4 h-4 text-[#CA8A04] inline block mr-1 mt-0.5 shrink-0 align-sub" />
                Sem reservas, você é forçado a vender com pressa seus pertences ou contrair dívidas usurárias a juros exorbitantes ao menor sinal de problema. Resguarde-se!
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
