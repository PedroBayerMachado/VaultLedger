import React, { useState, useEffect } from "react";
import { TrendingUp, RefreshCw, AlertCircle } from "lucide-react";

interface ExchangeRate {
  code: string;
  name: string;
  bid: string;
  pctChange: string;
}

export default function CurrencyTicker() {
  const [rates, setRates] = useState<ExchangeRate[]>([
    { code: "USD", name: "Dólar", bid: "5.42", pctChange: "+0.12" },
    { code: "EUR", name: "Euro", bid: "5.88", pctChange: "-0.05" },
    { code: "BTC", name: "Bitcoin", bid: "365000.00", pctChange: "+1.24" }
  ]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Carregado");

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL");
      if (response.ok) {
        const data = await response.json();
        const updatedRates: ExchangeRate[] = [
          {
            code: "USD",
            name: "Dólar",
            bid: parseFloat(data.USDBRL.bid).toFixed(2),
            pctChange: parseFloat(data.USDBRL.pctChange).toFixed(2)
          },
          {
            code: "EUR",
            name: "Euro",
            bid: parseFloat(data.EURBRL.bid).toFixed(2),
            pctChange: parseFloat(data.EURBRL.pctChange).toFixed(2)
          },
          {
            code: "BTC",
            name: "Bitcoin",
            bid: parseFloat(data.BTCBRL.bid).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
            pctChange: parseFloat(data.BTCBRL.pctChange).toFixed(2)
          }
        ];
        setRates(updatedRates);
        setLastUpdated(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      }
    } catch (error) {
      console.warn("Could not fetch real currency rates. Using fallback values.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Refresh every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1F2937] text-stone-300 py-2.5 px-6 border-b border-stone-850 flex flex-wrap items-center justify-between text-xs font-mono relative overflow-hidden">
      <div className="flex items-center gap-4.5 overflow-x-auto select-none no-scrollbar py-1">
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-[#CA8A04] bg-yellow-500/10 px-2 py-0.5 rounded-sm border border-yellow-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          Mercado Global (BRL)
        </span>

        {rates.map((rate) => {
          const isPositive = parseFloat(rate.pctChange) >= 0;
          return (
            <div key={rate.code} className="flex items-center gap-2 px-3 border-r border-[#374151] last:border-0 shrink-0">
              <span className="font-bold text-white">{rate.code}</span>
              <span className="text-stone-300 font-semibold">
                R$ {rate.bid}
              </span>
              <span className={`text-[10px] font-bold px-1 py-0.2 rounded-sm ${
                isPositive ? "bg-emerald-950/40 text-emerald-450" : "bg-red-950/40 text-red-400"
              }`}>
                {isPositive ? "+" : ""}{rate.pctChange}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-l border-stone-700/50 pl-4 mt-1 sm:mt-0 ml-auto shrink-0">
        <span className="text-[10px] text-stone-450">
          Atualizado: {lastUpdated}
        </span>
        <button
          onClick={fetchRates}
          disabled={loading}
          aria-label="Refresh rates"
          className="p-1 rounded-sm hover:bg-[#374151] text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}
