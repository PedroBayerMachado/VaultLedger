import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Landmark, Shield, Smile, Info, TrendingUp, Coins, HelpCircle, ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

export default function BudgetCalculator() {
  const [rendaInput, setRendaInput] = useState<string>("5000");

  // Load initial renda value from localstorage if any
  React.useEffect(() => {
    const saved = localStorage.getItem("vault_renda_mensal");
    if (saved) {
      setRendaInput(saved);
    }
  }, []);

  // States of Compound Interest Calculator
  const [aporteMensal, setAporteMensal] = useState<number>(300);
  const [taxaAnual, setTaxaAnual] = useState<number>(10);
  const [tempoAnos, setTempoAnos] = useState<number>(15);

  const renda = useMemo(() => {
    const parsed = parseFloat(rendaInput);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [rendaInput]);

  // Save renda value to localstorage on change
  React.useEffect(() => {
    localStorage.setItem("vault_renda_mensal", renda.toString());
  }, [renda]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    setRendaInput(val);
  };

  // Modern scenario allocations
  const cenarioModerno = useMemo(() => {
    return {
      necessidades: renda * 0.5,
      desejos: renda * 0.3,
      poupanca: renda * 0.2,
    };
  }, [renda]);

  // Babylonian scenario allocations (10% Pay yourself first, 90% for standard expenses)
  const cenarioBabilonico = useMemo(() => {
    return {
      pagarPrimeiro: renda * 0.1, // Minimum 10%
      despesasGerais: renda * 0.9, // Remaining 90%
    };
  }, [renda]);

  // Recharts Data for Modern
  const chartDataModern = useMemo(() => {
    return [
      { name: "Necessidades (50%)", value: cenarioModerno.necessidades, color: "#CA8A04" },
      { name: "Estilo de Vida (30%)", value: cenarioModerno.desejos, color: "#F5E264" },
      { name: "Futuro/Poupança (20%)", value: cenarioModerno.poupanca, color: "#1F2937" },
    ];
  }, [cenarioModerno]);

  // Recharts Data for Babylonian
  const chartDataBabylon = useMemo(() => {
    return [
      { name: "Pagar-se Primeiro (10%)", value: cenarioBabilonico.pagarPrimeiro, color: "#CA8A04" },
      { name: "Despesas Gerais (90%)", value: cenarioBabilonico.despesasGerais, color: "#D1D5DB" },
    ];
  }, [cenarioBabilonico]);

  // Compound Interest Calculation
  const simulacaoJuros = useMemo(() => {
    const pmt = aporteMensal;
    const taxaMensalDecimal = (taxaAnual / 12) / 100;
    const totalMeses = tempoAnos * 12;

    if (totalMeses <= 0) return { totalAcumulado: 0, totalInvestido: 0, jurosGanhos: 0 };

    let total = 0;
    if (taxaMensalDecimal === 0) {
      total = pmt * totalMeses;
    } else {
      // Future Value formula for ordinary annuity (deposits at the end of period)
      total = pmt * ((Math.pow(1 + taxaMensalDecimal, totalMeses) - 1) / taxaMensalDecimal);
    }

    const totalInvestido = pmt * totalMeses;
    const jurosGanhos = Math.max(0, total - totalInvestido);

    return {
      totalAcumulado: total,
      totalInvestido: totalInvestido,
      jurosGanhos: jurosGanhos,
    };
  }, [aporteMensal, taxaAnual, tempoAnos]);

  return (
    <section
      id="calculadora"
      className="py-24 bg-[#F9FAFB] border-b border-stone-200/50 relative overflow-hidden px-6 md:px-12 text-left"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header descriptivo */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#CA8A04] font-semibold block mb-3">
            02 . Simulador de Matemática Financeira
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
            A Proporção Áurea Financeira: 50/30/20 & Babilônia
          </h2>
          <div className="w-12 h-[2px] bg-[#EAB308] mx-auto my-5 rounded-full" />
          <p className="text-stone-500 text-sm sm:text-base font-light leading-relaxed">
            Sem planilhas complexas. Digite sua Renda Mensal abaixo e compare instantaneamente o método moderno e a lógica secular de Arkad.
          </p>
        </div>

        {/* Linha Principal do Simulador */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-20">
          
          {/* Lado Esquerdo: Input de Renda Mensal */}
          <div className="lg:col-span-4 bg-white border border-stone-200 p-8 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-base text-stone-900 font-semibold flex items-center gap-1.5">
                  <Coins className="w-4.5 h-4.5 text-[#CA8A04]" />
                  Sua Renda Mensal
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-yellow-50 text-[#CA8A04] px-2.5 py-0.5 rounded-full font-bold border border-yellow-100">
                  R$
                </span>
              </div>

              <p className="text-xs text-stone-500 font-light mb-6 leading-relaxed">
                Insira o seu rendimento líquido mensal líquido para ver o destino recomendado para cada centavo do seu dinheiro.
              </p>

              {/* Input Numérico Estilizado */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-stone-400 font-serif text-lg">
                  R$
                </div>
                <input
                  type="text"
                  id="calc-income-input-v2"
                  value={rendaInput}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  className="w-full pl-11 pr-5 py-3.5 text-2xl font-mono text-stone-900 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CA8A04] focus:border-[#CA8A04] focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Sliders Rápidos de Ajuda */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-stone-400">
                  <span>Ajuste Rápido</span>
                  <span className="font-bold text-stone-700">{formatCurrency(renda)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={renda === 0 ? "0" : renda.toString()}
                  onChange={(e) => setRendaInput(e.target.value)}
                  className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#CA8A04]"
                />
                <div className="flex justify-between text-[9px] font-mono text-stone-400">
                  <span>R$ 1.000</span>
                  <span>R$ 13.000</span>
                  <span>R$ 25.000</span>
                </div>
              </div>
            </div>

            {/* Simulações pré-definidas */}
            <div className="pt-6 border-t border-stone-100 mt-6 lg:mt-0">
              <span className="block text-[10px] uppercase font-mono text-stone-400 mb-2.5">Simular Valores</span>
              <div className="grid grid-cols-3 gap-2">
                {[3000, 5000, 10000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRendaInput(val.toString())}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer ${
                      renda === val
                        ? "bg-stone-900 border-stone-950 text-white"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {val >= 1000 ? `${val/1000}k` : val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lado Direito: Comparação de Cenários (A vs B) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* CARD CENÁRIO A: MODERNO (50/30/20) */}
            <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-stone-100 mb-5">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#CA8A04] font-bold block">Método Moderno</span>
                    <h4 className="font-serif text-base text-stone-900 font-semibold">Cenário A · Regra 50/30/20</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center font-bold text-xs text-[#CA8A04] border border-yellow-100">
                    A
                  </div>
                </div>

                <p className="text-xs text-stone-400 font-light leading-relaxed mb-6">
                  Divisão ideal para equilibrar sobrevivência com prazer presente e construção inteligente de patrimônio a médio prazo.
                </p>

                {/* Donut Chart de Rosca de Recharts */}
                <div className="h-[140px] w-full flex items-center justify-center mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartDataModern}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartDataModern.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Subdivisões de Valores */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-stone-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#CA8A04]" />
                      Necessidades (50%)
                    </span>
                    <span className="font-mono font-semibold text-stone-850">
                      {formatCurrency(cenarioModerno.necessidades)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-stone-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F5E264]" />
                      Estilo/Desejos (30%)
                    </span>
                    <span className="font-mono font-semibold text-stone-850">
                      {formatCurrency(cenarioModerno.desejos)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-stone-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-800" />
                      Poupança (20%)
                    </span>
                    <span className="font-mono font-semibold text-stone-900">
                      {formatCurrency(cenarioModerno.poupanca)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD CENÁRIO B: SECULAR (BABILÔNIA) */}
            <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-stone-100 mb-5">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-stone-500 font-bold block">Conselho Secular</span>
                    <h4 className="font-serif text-base text-stone-900 font-semibold">Cenário B · 1ª Lei de Ouro</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#eef0f4] flex items-center justify-center font-bold text-xs text-stone-700 border border-stone-200/50">
                    B
                  </div>
                </div>

                <p className="text-xs text-stone-400 font-light leading-relaxed mb-6">
                  "Pague-se Primeiro" imediato de, no mínimo, 10% de tudo para construir patrimônio imutável. Os 90% restantes pagam obrigações diárias.
                </p>

                {/* Donut Chart de Rosca para Babilônico */}
                <div className="h-[140px] w-full flex items-center justify-center mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartDataBabylon}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartDataBabylon.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Subdivisões Babilônicas */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-stone-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#CA8A04]" />
                      Pagar-se Primeiro (10%)
                    </span>
                    <span className="font-mono font-semibold text-stone-900 text-[#CA8A04]">
                      {formatCurrency(cenarioBabilonico.pagarPrimeiro)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-stone-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                      Despesas Ordinárias (90%)
                    </span>
                    <span className="font-mono font-semibold text-stone-850">
                      {formatCurrency(cenarioBabilonico.despesasGerais)}
                    </span>
                  </div>

                  {/* Informacional */}
                  <div className="pt-2">
                    <p className="text-[10px] text-stone-400 italic leading-snug">
                      * O homem mais rico da Babilônia ensina que manter no mínimo 10% acumulado investido é o alicerce para atrair riqueza crescente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* PARTE 2: Juros Compostos ("Multiplique seu Ouro") */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-xs text-left">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-100 mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-50 border border-yellow-100 rounded-xl text-[#CA8A04]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 font-semibold">
                  Multiplique seu Ouro: Os Juros Compostos
                </h3>
                <p className="text-xs text-stone-400 font-light">
                  Veja como os "filhos e netos" do seu ouro inicial continuam gerando mais ouro com o tempo.
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-100 px-4 py-2 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-[#CA8A04] block leading-none font-semibold">Total Acumulado</span>
              <span className="font-mono text-xl font-bold text-stone-900 block mt-1">
                {formatCurrency(simulacaoJuros.totalAcumulado)}
              </span>
            </div>
          </div>

          {/* Form Calculadora de Juros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Input 1: Aporte Mensal */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-1.5">
                Aporte Mensal Constante (R$)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 text-xs text-medium">R$</span>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  value={aporteMensal}
                  onChange={(e) => setAporteMensal(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 text-stone-850 font-mono focus:outline-none focus:ring-1 focus:ring-[#CA8A04] focus:border-[#CA8A04]"
                />
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={aporteMensal}
                onChange={(e) => setAporteMensal(parseFloat(e.target.value))}
                className="w-full accent-[#CA8A04] mt-2 h-1 bg-stone-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Input 2: Taxa de Juros Anual */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-1.5">
                Taxa de Juros Anual (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="0.5"
                  value={taxaAnual}
                  onChange={(e) => setTaxaAnual(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 text-stone-850 font-mono focus:outline-none focus:ring-1 focus:ring-[#CA8A04] focus:border-[#CA8A04]"
                />
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 text-xs font-mono">% a.a.</span>
              </div>
              <input
                type="range"
                min="3"
                max="18"
                step="0.5"
                value={taxaAnual}
                onChange={(e) => setTaxaAnual(parseFloat(e.target.value))}
                className="w-full accent-[#CA8A04] mt-2 h-1 bg-stone-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Input 3: Tempo em Anos */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-1.5">
                Horizonte Temporal (Anos)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={tempoAnos}
                  onChange={(e) => setTempoAnos(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 text-stone-850 font-mono focus:outline-none focus:ring-1 focus:ring-[#CA8A04] focus:border-[#CA8A04]"
                />
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 text-xs">Anos</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={tempoAnos}
                onChange={(e) => setTempoAnos(parseInt(e.target.value))}
                className="w-full accent-[#CA8A04] mt-2 h-1 bg-stone-100 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Barra de Progresso de Capital vs Juros Acumulados */}
          <div className="bg-stone-50 border border-stone-150 p-5 rounded-2xl mb-8">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-stone-400 mb-3 block">
              Proporção Acumulada após {tempoAnos} anos
            </h4>

            {/* Progress Bar Container */}
            <div className="w-full h-5 rounded-full bg-stone-200 overflow-hidden flex border border-stone-300">
              {simulacaoJuros.totalAcumulado > 0 && (
                <>
                  <div
                    className="h-full bg-stone-800 transition-all duration-300 relative group"
                    style={{ width: `${(simulacaoJuros.totalInvestido / simulacaoJuros.totalAcumulado) * 100}%` }}
                    title={`Investido: ${formatCurrency(simulacaoJuros.totalInvestido)}`}
                  />
                  <div
                    className="h-full bg-[#CA8A04] transition-all duration-300 relative group"
                    style={{ width: `${(simulacaoJuros.jurosGanhos / simulacaoJuros.totalAcumulado) * 100}%` }}
                    title={`Juros recebidos: ${formatCurrency(simulacaoJuros.jurosGanhos)}`}
                  />
                </>
              )}
            </div>

            {/* Indicadores */}
            <div className="flex flex-wrap justify-between gap-4 mt-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-800" />
                <span>Capital Investido: <strong>{formatCurrency(simulacaoJuros.totalInvestido)}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-900">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CA8A04]" />
                <span>Juros Ganhos (Lucro do Ouro): <strong className="text-[#CA8A04]">{formatCurrency(simulacaoJuros.jurosGanhos)}</strong></span>
              </div>
            </div>
          </div>

          {/* Citações da Babilônia sobre Investir */}
          <div className="flex items-start gap-3 text-xs text-stone-400 font-light leading-relaxed">
            <Info className="w-4 h-4 text-[#CA8A04] shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold text-stone-700">A 3ª Lei de Ouro:</strong> "O ouro trabalha de bom grado e de forma diligente para o dono sábio, multiplicando-se vigorosamente ao longo dos anos." Deixe que o tempo e os juros compostos trabalhem silenciosamente por você.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
