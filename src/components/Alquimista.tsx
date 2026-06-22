import React, { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { Coins, HelpCircle, ArrowRight, ShieldCheck, Scale, Compass, Award, Gem, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "./Toast";

export default function Alquimista() {
  // Simulator State
  const [aporteInicial, setAporteInicial] = useState<number>(1000);
  const [aporteMensal, setAporteMensal] = useState<number>(300);
  const [taxaAnual, setTaxaAnual] = useState<number>(11);
  const [tempoAnos, setTempoAnos] = useState<number>(20);

  // Independência state
  const [custoVidaMensal, setCustoVidaMensal] = useState<number>(3500);

  // Load from local storage
  React.useEffect(() => {
    const savedCusto = localStorage.getItem("vault_custo_mensal");
    if (savedCusto) {
      setCustoVidaMensal(parseFloat(savedCusto) || 3500);
    }
  }, []);

  // Save changes to local storage
  const updateCustoVida = (val: number) => {
    setCustoVidaMensal(val);
    localStorage.setItem("vault_custo_mensal", val.toString());
  };

  // Compound growth calculation month-by-month for chart
  const dataGrafico = useMemo(() => {
    const data = [];
    let acumulado = aporteInicial;
    let investido = aporteInicial;
    const taxaCorridaMensal = (taxaAnual / 12) / 100;

    // We push initial state
    data.push({
      ano: 0,
      "Você Trabalhando (Investido)": Math.round(investido),
      "Seu Ouro Multiplicado": Math.round(acumulado),
      juros: 0
    });

    for (let mes = 1; mes <= tempoAnos * 12; mes++) {
      investido += aporteMensal;
      acumulado = (acumulado * (1 + taxaCorridaMensal)) + aporteMensal;

      // Log stats only every year to avoid 240+ dense points on charts, keeping it smooth
      if (mes % 12 === 0) {
        const ano = mes / 12;
        data.push({
          ano,
          "Você Trabalhando (Investido)": Math.round(investido),
          "Seu Ouro Multiplicado": Math.round(acumulado),
          juros: Math.max(0, Math.round(acumulado - investido))
        });
      }
    }
    return data;
  }, [aporteInicial, aporteMensal, taxaAnual, tempoAnos]);

  // Final values
  const totalInvestido = useMemo(() => {
    return aporteInicial + (aporteMensal * tempoAnos * 12);
  }, [aporteInicial, aporteMensal, tempoAnos]);

  const totalAcumuladoValue = useMemo(() => {
    const taxaCorridaMensal = (taxaAnual / 12) / 100;
    const totalMeses = tempoAnos * 12;
    let total = aporteInicial * Math.pow(1 + taxaCorridaMensal, totalMeses);
    
    if (taxaCorridaMensal > 0) {
      total += aporteMensal * ((Math.pow(1 + taxaCorridaMensal, totalMeses) - 1) / taxaCorridaMensal);
    } else {
      total += aporteMensal * totalMeses;
    }
    return total;
  }, [aporteInicial, aporteMensal, taxaAnual, tempoAnos]);

  const totalJuros = useMemo(() => {
    return Math.max(0, totalAcumuladoValue - totalInvestido);
  }, [totalAcumuladoValue, totalInvestido]);

  // Multiplier
  const multiplicadorOuro = useMemo(() => {
    return totalInvestido > 0 ? (totalAcumuladoValue / totalInvestido).toFixed(1) : "1.0";
  }, [totalAcumuladoValue, totalInvestido]);

  // Regra de 25 Calculations
  const numeroLiberdade = useMemo(() => {
    return custoVidaMensal * 12 * 25;
  }, [custoVidaMensal]);

  const formatBRL = (val: number) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    });
  };

  const handleSimulateCustom = (v1: number, v2: number, rate: number, years: number) => {
    setAporteInicial(v1);
    setAporteMensal(v2);
    setTaxaAnual(rate);
    setTempoAnos(years);
    showToast(`Ouro calibrado: R$ ${v2}/mês a ${rate}% a.a.`, "success");
  };

  return (
    <section id="alquimista" className="py-24 bg-white border-b border-stone-200/50 px-6 md:px-12 text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#CA8A04] font-semibold block mb-3">
            04 . O Alquimista Financeiro
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
            Filhos e Netos do Ouro: Os Juros Exponenciais
          </h2>
          <div className="w-12 h-[2px] bg-[#EAB308] mx-auto my-5 rounded-full" />
          <p className="text-stone-500 text-sm sm:text-base font-light leading-relaxed">
            "Cada moeda de ouro acumulada é um servo que trabalha por você. Seus frutos são os filhos dele, que também geram netos no ciclo perpétuo dos juros compostos."
          </p>
        </div>

        {/* Compound Interest Simulator layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          
          {/* Side Inputs Controls */}
          <div className="lg:col-span-4 bg-[#F9FAFB] border border-stone-200 p-8 rounded-3xl space-y-6">
            <h3 className="font-serif text-base text-stone-900 font-semibold flex items-center gap-2">
              <Gem className="w-4.5 h-4.5 text-[#CA8A04]" />
              Fórmula de Multiplicação
            </h3>

            {/* Initial Input */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-1.5">
                Alocação Inicial (Ouro Guardado)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 text-xs font-serif">R$</span>
                <input
                  type="number"
                  min="0"
                  max="1000000"
                  value={aporteInicial}
                  onChange={(e) => setAporteInicial(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                />
              </div>
            </div>

            {/* Monthly Contribution */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-1.5">
                Investimento Mensal (Ouro Adicional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 text-xs font-serif">R$</span>
                <input
                  type="number"
                  min="10"
                  max="100000"
                  value={aporteMensal}
                  onChange={(e) => setAporteMensal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                />
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={aporteMensal}
                onChange={(e) => setAporteMensal(parseInt(e.target.value))}
                className="w-full accent-[#CA8A04] mt-2.5 h-1 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Annual interest rate */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-1.5 flex justify-between">
                <span>Rendimento do Ouro (% ao Ano)</span>
                <span className="text-[#CA8A04] font-bold">{taxaAnual}% a.a.</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="25"
                  step="0.5"
                  value={taxaAnual}
                  onChange={(e) => setTaxaAnual(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                />
              </div>
              <input
                type="range"
                min="3"
                max="18"
                step="0.5"
                value={taxaAnual}
                onChange={(e) => setTaxaAnual(parseFloat(e.target.value))}
                className="w-full accent-[#CA8A04] mt-2.5 h-1 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Time in years */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-1.5 flex justify-between">
                <span>Horizonte Temporal</span>
                <span className="text-[#CA8A04] font-bold">{tempoAnos} Anos</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={tempoAnos}
                  onChange={(e) => setTempoAnos(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                />
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={tempoAnos}
                onChange={(e) => setTempoAnos(parseInt(e.target.value))}
                className="w-full accent-[#CA8A04] mt-2.5 h-1 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Smart presets */}
            <div className="pt-4 border-t border-stone-200">
              <span className="block text-[9px] uppercase font-mono tracking-widest text-stone-400 mb-2">Simular Caminhos Célebres</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <button
                  onClick={() => handleSimulateCustom(0, 300, 11, 15)}
                  className="py-1.5 px-2.5 rounded bg-white hover:bg-stone-100 border border-stone-200 transition-colors text-[10px] font-semibold text-stone-650 cursor-pointer"
                >
                  Caminho do Iniciante
                </button>
                <button
                  onClick={() => handleSimulateCustom(2000, 1000, 12, 25)}
                  className="py-1.5 px-2.5 rounded bg-white hover:bg-stone-100 border border-stone-200 transition-colors text-[10px] font-semibold text-stone-650 cursor-pointer"
                >
                  Caminho do Patriarca
                </button>
              </div>
            </div>

          </div>

          {/* Right Visualizer Panel & Chart */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Golden Cards summary metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-[#1F2937] text-white rounded-2xl p-5 border border-stone-850">
                <span className="text-[9px] uppercase font-mono tracking-wider text-stone-450">Seu Suor (Poupado)</span>
                <div className="text-xl font-mono font-bold mt-1 text-slate-100">
                  {formatBRL(totalInvestido)}
                </div>
                <span className="text-[10px] text-stone-500 font-sans block mt-1 leading-none">
                  Aportes diretos acumulados
                </span>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5">
                <span className="text-[9px] uppercase font-mono tracking-wider text-[#CA8A04] font-bold">Ouro Multiplicado (Juros)</span>
                <div className="text-xl font-mono font-bold mt-1 text-[#CA8A04]">
                  {formatBRL(totalJuros)}
                </div>
                <span className="text-[10px] text-stone-500 font-sans block mt-1 leading-none">
                  Sua semente trabalhando 24h
                </span>
              </div>

              <div className="bg-yellow-50/50 border border-yellow-250 rounded-2xl p-5">
                <span className="text-[9px] uppercase font-mono tracking-wider text-stone-500">Poder de Alavancagem</span>
                <div className="text-xl font-mono font-bold mt-1 text-stone-900 flex items-center gap-1">
                  {multiplicadorOuro}x <span className="text-xs font-light text-stone-500">o valor poupado</span>
                </div>
                <span className="text-[10px] text-[#CA8A04] font-serif block mt-1 leading-none font-semibold">
                  Seu patrimônio expandido
                </span>
              </div>

            </div>

            {/* Recharts Compound Chart Line */}
            <div className="bg-[#F9FAFB] border border-stone-200 p-6 rounded-3xl">
              <h4 className="font-serif text-sm font-semibold text-stone-900 mb-6 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#CA8A04]" />
                Curva Exponencial: Ouro em Aceleração
              </h4>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataGrafico} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1ee" />
                    <XAxis dataKey="ano" name="Anos" unit="a" stroke="#a8a29e" fontSize={11} fontStyle="italic" />
                    <YAxis
                      stroke="#a8a29e"
                      fontSize={11}
                      tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + "k" : val}`}
                    />
                    <Tooltip
                      formatter={(val: number) => [formatBRL(val), ""]}
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e7e5e4", borderRadius: "10px" }}
                      labelStyle={{ fontFamily: "serif", fontWeight: "bold" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "sans-serif", paddingTop: "10px" }} />
                    <Line
                      type="monotone"
                      dataKey="Você Trabalhando (Investido)"
                      stroke="#78716c"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Seu Ouro Multiplicado"
                      stroke="#CA8A04"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>

        {/* Independabilidade - REGRA DOS 25 */}
        <div className="border border-stone-200 bg-linear-to-b from-[#F9FAFB] to-white rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="pb-6 border-b border-stone-200/60 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-yellow-50 border border-yellow-150 rounded-xl text-[#CA8A04]">
                <Scale className="w-5.5 h-5.5" />
              </div>
              <div className="text-left">
                <h3 className="font-serif text-lg text-stone-950 font-bold">
                  Bandeira de Alforria: A Regra dos 25
                </h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Descubra o valor exato no qual o seu patrimônio gera renda passiva suficiente para custear viver livre perpetuamente.
                </p>
              </div>
            </div>

            <div className="bg-stone-900 text-white px-5 py-3 rounded-2xl flex flex-col text-left justify-center shrink-0">
              <span className="text-[9px] uppercase font-mono text-stone-400 block tracking-wider leading-none">Número da Independência (FIRE)</span>
              <span className="font-mono text-lg sm:text-2xl font-black text-amber-400 block mt-1.5 leading-none">
                {formatBRL(numeroLiberdade)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Custo de Vida Input */}
            <div className="lg:col-span-4 bg-white border border-stone-200 p-6 rounded-2xl">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#CA8A04] font-bold block mb-3">Inserir Seu Custo Mensal</span>
              <p className="text-xs text-stone-500 mb-4 font-light">Informe o montante de sobrevivência mensal desejado (casa, alimentação, saúde, lazer vital).</p>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 text-sm font-serif">R$</span>
                <input
                  type="number"
                  min="200"
                  max="200000"
                  value={custoVidaMensal}
                  onChange={(e) => updateCustoVida(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-stone-200 text-sm font-mono text-stone-900 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#CA8A04]"
                />
              </div>

              {/* Slider helper */}
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={custoVidaMensal}
                onChange={(e) => updateCustoVida(parseInt(e.target.value))}
                className="w-full accent-[#CA8A04] mt-4 h-1 bg-stone-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Informational results layout */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              
              <div className="p-5 border border-[#F3F4F6] rounded-2xl bg-white">
                <span className="text-[9px] uppercase font-mono text-stone-400 block font-bold">A Lógica da Regra (4% SWR)</span>
                <p className="text-xs text-stone-500 font-light mt-2 leading-relaxed">
                  Para sobreviver sem trabalhar do seu ouro, você precisa de um patrimônio igual a <strong className="font-semibold text-stone-800">25x seu gasto anual</strong>. Ao retirar no máximo <strong className="font-semibold text-[#CA8A04]">4% ao ano</strong> deste tesouro, o principal se mantém intacto corrigido pela inflação.
                </p>
              </div>

              <div className="p-5 border border-[#F3F4F6] rounded-2xl bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono text-[#CA8A04] tracking-widest block font-bold">Rendimento Gerado Geracional</span>
                  <div className="text-2xl font-mono font-bold text-stone-900 mt-1">
                    {formatBRL(custoVidaMensal)} / <span className="text-xs text-stone-500 font-sans font-light">mês de renda eterna</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-stone-100 mt-3 text-[10px] text-stone-400 font-light italic">
                  * Assumindo que o dinheiro está alocado em ativos que auferem retornos acima da inflação anual.
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
