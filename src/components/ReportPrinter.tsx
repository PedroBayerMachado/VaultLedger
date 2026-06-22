import React from "react";
import { Printer } from "lucide-react";
import { showToast } from "./Toast";

export default function ReportPrinter() {
  const formatBRL = (val: number) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    });
  };

  const triggerPrintPDF = () => {
    // Dynamically retrieve all states from LocalStorage at click-time
    const currentRenda = parseFloat(localStorage.getItem("vault_renda_mensal") || "5000");
    const currentCusto = parseFloat(localStorage.getItem("vault_custo_mensal") || "3000");
    const currentStability = localStorage.getItem("vault_regime_estabilidade") || "clt_autonomo";
    const currentSaldoReserva = parseFloat(localStorage.getItem("vault_saldo_salvo") || "5000");
    const currentMesesReserva = parseInt(localStorage.getItem("vault_meses_desejados") || "6");
    const currentXP = localStorage.getItem("vault_lifetime_xp") || "50";

    const allocations = {
      vital: currentRenda * 0.5,
      lifestyle: currentRenda * 0.3,
      future: currentRenda * 0.2,
      saved10: currentRenda * 0.1
    };

    const targetReserve = currentCusto * currentMesesReserva;
    const fortressPercent = targetReserve > 0 ? Math.min(100, Math.round((currentSaldoReserva / targetReserve) * 100)) : 0;
    const regimeLabel = currentStability === "servidor" ? "Servidor Público (Alta)" : "Autônomo ou CLT (Dinâmica)";

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Por favor, ative os popups de redirecionamento para visualizar o PDF imprimível do seu relatório.", "warning");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>VaultLedger - Relatório de Estabilidade e Psicologia Financeira</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
            body {
              font-family: "Plus Jakarta Sans", sans-serif;
              color: #1c1917;
              background: #fff;
              padding: 40px;
              line-height: 1.6;
            }
            .header-banner {
              border-bottom: 2px solid #CA8A04;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .title-main {
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              font-weight: 700;
              margin: 0;
              color: #111;
            }
            .subtitle {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #CA8A04;
              margin: 5px 0 0 0;
              font-weight: bold;
            }
            .grid-stats {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .card {
              border: 1px solid #e7e5e4;
              border-radius: 12px;
              padding: 20px;
              background-color: #fafaf9;
            }
            .card-title {
              font-family: 'Playfair Display', serif;
              font-size: 16px;
              font-weight: bold;
              margin-top: 0;
              margin-bottom: 15px;
              color: #CA8A04;
              border-bottom: 1px solid #e7e5e4;
              padding-bottom: 8px;
            }
            .val-row {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              margin-bottom: 8px;
            }
            .val-row strong {
              color: #111;
            }
            .highlight-box {
              background: #fefdf0;
              border-left: 4px solid #CA8A04;
              border-radius: 4px;
              padding: 15px;
              margin-bottom: 30px;
              font-size: 13px;
            }
            .footer-info {
              border-top: 1px solid #e7e5e4;
              padding-top: 20px;
              margin-top: 40px;
              font-size: 10px;
              color: #78716c;
              text-align: center;
              font-family: monospace;
            }
            .non-printable {
              text-align: center;
              margin-bottom: 20px;
              background: #f5e264;
              padding: 15px;
              font-size: 12px;
              border-radius: 8px;
              font-weight: bold;
            }
            @media print {
              .non-printable { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="non-printable">
            Seu relatório de estabilidade financeira foi montado! Clique em "Imprimir / Salvar PDF" ou use Ctrl+P para guardar.
            <br/>
            <button onclick="window.print()" style="margin-top: 10px; padding: 6px 15px; background: #000; color: #fff; cursor: pointer; border: none; border-radius: 4px; font-weight: bold;">
              Imprimir / Salvar PDF
            </button>
          </div>

          <div class="header-banner">
            <div>
              <h1 class="title-main">VaultLedger</h1>
              <p class="subtitle">Dossiê Consolidado de Estabilidade Financeira</p>
            </div>
            <div style="text-align: right; font-size: 11px; color: #78716c;">
              Emissão: ${new Date().toLocaleDateString("pt-BR")}<br/>
              Pontos de Sabedoria (Mente): ${currentXP} XP
            </div>
          </div>

          <div class="highlight-box">
            <strong>Preceito de Sabedoria de Arkad</strong>: "O controle dos seus sentimentos conduz a despesas controladas e ao florescer da estabilidade pessoal. Habitue-se a planejar o seu amanhã com humildade e as moedas de ouro se multiplicarão de bom grado na sua carteira."
          </div>

          <div class="grid-stats">
            
            <div class="card">
              <h3 class="card-title">Distribuição de Renda 50/30/20</h3>
              <div class="val-row">
                <span>Renda Líquida Declarada:</span>
                <strong>${formatBRL(currentRenda)}</strong>
              </div>
              <div class="val-row">
                <span>Necessidades Essenciais (50%):</span>
                <strong>${formatBRL(allocations.vital)}</strong>
              </div>
              <div class="val-row">
                <span>Estilo de Vida e Prazer (30%):</span>
                <strong>${formatBRL(allocations.lifestyle)}</strong>
              </div>
              <div class="val-row">
                <span>Poupança e Investimento (20%):</span>
                <strong>${formatBRL(allocations.future)}</strong>
              </div>
              <div class="val-row" style="margin-top: 12px; border-top: 1px dashed #e7e5e4; padding-top: 8px;">
                <span>Dízimo Seculo de Ouro (Babilônia 10%):</span>
                <strong style="color: #CA8A04;">${formatBRL(allocations.saved10)}</strong>
              </div>
            </div>

            <div class="card">
              <h3 class="card-title">Muralha da Reserva de Emergência</h3>
              <div class="val-row">
                <span>Regime Estabilidade:</span>
                <strong>${regimeLabel}</strong>
              </div>
              <div class="val-row">
                <span>Custo de Sobrevivência Mensal:</span>
                <strong>${formatBRL(currentCusto)}</strong>
              </div>
              <div class="val-row">
                <span>Tempo de Segurança Escolhido:</span>
                <strong>${currentMesesReserva} Meses</strong>
              </div>
              <div class="val-row" style="border-top: 1px dashed #e7e5e4; margin-top: 8px; padding-top: 8px;">
                <span>Alvo da Reserva Protetora:</span>
                <strong>${formatBRL(targetReserve)}</strong>
              </div>
              <div class="val-row">
                <span>Saldo Acumulado Atual:</span>
                <strong>${formatBRL(currentSaldoReserva)}</strong>
              </div>
              <div class="val-row">
                <span>Proteção do Escudo:</span>
                <strong style="color: #CA8A04;">${fortressPercent}% Protegido</strong>
              </div>
            </div>

          </div>

          <div class="card" style="margin-bottom: 30px;">
            <h3 class="card-title">Procurando a Independência Financeira (Regra dos 25)</h3>
            <p style="font-size: 12px; color: #555; margin-bottom: 15px;">
              A independência financeira significa trabalhar por prazer e deitar a cabeça com o amanhã garantido. Veja quanto de principal você precisa ter gerado para custear suas despesas básicas eternamente com juros absolutos (4% de taxa segura de saque):
            </p>
            <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 20px; font-size: 13px;">
              <div>
                <span>Custo Básico de Vida Anual:</span><br/>
                <strong style="font-size: 16px;">${formatBRL(currentCusto * 12)}</strong>
              </div>
              <div>
                <span>Patrimônio Alvo para Independência (FIRE):</span><br/>
                <strong style="font-size: 20px; color: #CA8A04;">${formatBRL(currentCusto * 12 * 25)}</strong>
              </div>
            </div>
          </div>

          <div class="footer-info">
            Dossiê emitido de forma offline privada em Sandbox local pela inteligência VaultLedger. Nenhuma informação foi divulgada a provedores externos.
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    showToast("Relatório de controle fiduciário montado! Preparando PDF...", "success");
  };

  return (
    <button
      onClick={triggerPrintPDF}
      id="print-pdf-report-btn"
      className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-stone-900 to-stone-950 text-white hover:from-[#CA8A04] hover:to-[#EAB308] font-semibold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
    >
      <Printer className="w-4.5 h-4.5" />
      Gerar Orçamento / Relatório PDF Imprimível
    </button>
  );
}
