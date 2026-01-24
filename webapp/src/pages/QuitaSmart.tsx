import React, { useEffect, useState } from 'react';

import { useQuitaSmart } from '../hooks/useQuitaSmart';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Range } from '../components/Range';
import { trackEvent } from '../services/analytics';
import { formatCurrency, formatMoneyInput } from '../utils/formatters';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const QuitaSmart: React.FC = () => {
    const { financing, consortium, updateFinancing, updateConsortium, result } = useQuitaSmart();
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        trackEvent('view_screen', { screen_name: 'quitasmart' });
    }, []);

    const handleSimulate = () => {
        trackEvent('calculate_quitacao', {
            valor_financiado: financing.totalValue,
            prazo: financing.totalTerm,
            tipo: financing.type
        });
        setShowResults(true);
    };

    // --- Charts Data Prep ---
    const evoData = {
        labels: result?.evolutionChart.debtBalance.map((_, i) => i) || [],
        datasets: [
            {
                label: 'Saldo Devedor',
                data: result?.evolutionChart.debtBalance || [],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
            {
                label: 'Valor da Carta',
                data: result?.evolutionChart.letterValue || [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                stepped: 'after' as const,
                pointRadius: 0,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
            x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
        }
    };

    return (
        <div className="w-full max-w-7xl animate-fade-in">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-xl border-b border-white/5 py-4 mb-4">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="text-center w-full">
                        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                            Quita Smart
                        </h1>
                        <p className="text-slate-400 text-xs md:text-sm">A estratégia inteligente para quitar seu imóvel</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                    {/* Inputs Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="p-6 border-l-4 border-l-blue-500">
                            <h2 className="text-lg font-semibold text-white mb-4">Dados do Financiamento</h2>

                            {/* Radio financing.type */}
                            <div className="mb-6 flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={financing.type === 'novo'}
                                        onChange={() => updateFinancing('type', 'novo')}
                                        className="text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-200">Novo</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={financing.type === 'andamento'}
                                        onChange={() => updateFinancing('type', 'andamento')}
                                        className="text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-200">Em Andamento</span>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <div className="w-full">
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        {financing.type === 'novo' ? 'Valor Financiado' : 'Saldo Devedor Atual'}
                                    </label>
                                    <Input
                                        value={formatCurrency(financing.totalValue)}
                                        onChange={(e) => updateFinancing('totalValue', formatMoneyInput(e.target.value))}
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Prazo Total (Meses)
                                    </label>
                                    <Input
                                        type="number"
                                        value={financing.totalTerm}
                                        onChange={(e) => updateFinancing('totalTerm', parseInt(e.target.value))}
                                    />
                                </div>

                                {financing.type === 'andamento' && (
                                    <div className="w-full">
                                        <label className="block text-xs font-medium text-slate-300 mb-1">
                                            Parcelas Pagas
                                        </label>
                                        <Input
                                            type="number"
                                            value={financing.paidInstallments}
                                            onChange={(e) => updateFinancing('paidInstallments', parseInt(e.target.value))}
                                        />
                                    </div>
                                )}

                                <div className="w-full">
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Juros Anual (%)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={financing.interestRateAnnual}
                                        onChange={(e) => updateFinancing('interestRateAnnual', parseFloat(e.target.value))}
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-700/50">
                                    <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase">Configuração Consórcio</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            label="Taxa Adm Total (%)"
                                            type="number"
                                            step="0.1"
                                            value={consortium.adminFeeTotal}
                                            onChange={(e) => updateConsortium('adminFeeTotal', parseFloat(e.target.value))}
                                        />
                                        <Input
                                            label="Fundo Reserva (%)"
                                            type="number"
                                            step="0.1"
                                            value={consortium.reserveFundTotal}
                                            onChange={(e) => updateConsortium('reserveFundTotal', parseFloat(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                fullWidth
                                onClick={handleSimulate}
                                className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600"
                            >
                                Simular Quitação
                            </Button>
                        </Card>
                    </div>

                    {/* Results Column */}
                    {showResults && result && (
                        <div className="lg:col-span-8 space-y-6 animate-fade-in-up">
                            <Card className="p-6">
                                <h3 className="text-white font-bold mb-6">Resultado da Estratégia</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                        <span className="text-slate-400 block text-xs uppercase tracking-wider">Economia Projetada</span>
                                        <span className="text-2xl font-bold text-emerald-400">{formatCurrency(result.economy)}</span>
                                    </div>
                                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                        <span className="text-slate-400 block text-xs uppercase tracking-wider">Carta Necessária (Hoje)</span>
                                        <span className="text-xl font-bold text-blue-400">{formatCurrency(result.requiredLetter)}</span>
                                    </div>
                                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col justify-center">
                                        <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Na Quitação (Mês {consortium.term})</span>
                                        <div className="flex justify-between items-end border-b border-slate-700 pb-1 mb-1">
                                            <span className="text-xs text-slate-500">Saldo Devedor:</span>
                                            <span className="font-bold text-red-300">{formatCurrency(result.futureDebtBalance)}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs text-slate-500">Carta Corrigida:</span>
                                            <span className="font-bold text-blue-300">{formatCurrency(result.futureLetterValue)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Detalhes da Cota (Enhanced) */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Crédito Base</span>
                                        <span className="block text-sm font-bold text-white">{formatCurrency(result.requiredLetter)}</span>
                                    </div>
                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Prazo Plano</span>
                                        <span className="block text-sm font-bold text-white">{consortium.term} meses</span>
                                    </div>
                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Parcela Cheia</span>
                                        <span className="block text-sm font-bold text-white">{formatCurrency(result.initialInstallmentCons)}</span>
                                    </div>
                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">1ª Parcela</span>
                                        <span className="block text-sm font-bold text-white">{formatCurrency(result.initialInstallmentCons)}</span>
                                    </div>
                                </div>

                                {/* Demonstrativo da Economia (Restored) */}
                                <div className="mb-6 p-4 bg-slate-900/30 rounded-xl border border-dashed border-slate-700 text-xs">
                                    <h4 className="text-slate-300 font-semibold mb-2">Demonstrativo da Economia:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 font-medium">1. Total de Juros Estimado (Financiamento):</span>
                                            <span className="text-slate-300">{formatCurrency(result.totalCostOriginal)}</span>
                                        </div>
                                        <div className="md:col-span-2 text-[10px] text-slate-600 mb-1">
                                            (Valor total SOMENTE dos juros se mantiver o financiamento até o fim)
                                        </div>

                                        <div className="flex justify-between mt-2">
                                            <span className="text-slate-500 font-medium">2. Custo da Estratégia (Juros + Taxas):</span>
                                            <span className="text-red-300">{formatCurrency(result.totalCostStrategy)}</span>
                                        </div>
                                        <div className="md:col-span-2 text-[10px] text-slate-600">
                                            Composto por: Juros pagos até mês {consortium.term} ({formatCurrency(result.interestPaidUntilQuit)}) + Taxas Administrativas do Consórcio ({formatCurrency(result.consortiumFees)}).
                                        </div>

                                        <div className="md:col-span-2 mt-3 pt-2 border-t border-slate-800 flex justify-between items-center">
                                            <span className="text-emerald-500 font-bold">ECONOMIA (1 - 2):</span>
                                            <span className="text-xl font-bold text-emerald-400">{formatCurrency(result.economy)}</span>
                                        </div>

                                        <div className="md:col-span-2 mt-2 p-2 bg-blue-900/10 rounded text-blue-300/80 italic text-center">
                                            Nota: A economia reflete a redução de custos "a fundo perdido" (Juros e Taxas). O valor do principal (bem adquirido) é investimento em ambos os casos.
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Area */}
                                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                    <h4 className="text-slate-300 text-sm font-semibold mb-4">Evolução: Saldo Devedor vs. Carta</h4>
                                    <div className="relative h-64 w-full">
                                        <Line data={evoData} options={chartOptions as any} />
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-800">
                                        <div className="mb-2 text-[10px] text-slate-400 italic">
                                            O valor atual da carta foi calculado considerando o uso no final do prazo de <span className="text-blue-300 font-bold">{consortium.term}</span> meses. Ajuste o prazo total da cota para obter outros valores de carta atual.
                                        </div>
                                        <Range
                                            label="Ajuste o Prazo da Cota (Meses)"
                                            min="60"
                                            max="200"
                                            value={consortium.term}
                                            valueDisplay={consortium.term}
                                            onChange={(e) => updateConsortium('term', parseInt(e.target.value))}
                                            minLabel="60 meses"
                                            maxLabel="200 meses"
                                        />
                                    </div>
                                </div>

                                {/* Monthly Flow Stats (Restored) */}
                                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 mt-4">
                                    <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-400">
                                        {/* Column 1: Initial Commitment */}
                                        <div className="px-2 border-r border-slate-700">
                                            <div className="text-xs text-slate-300 font-bold mb-2 uppercase tracking-wide text-center">Comprometimento Inicial</div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-red-400">Financiamento:</span>
                                                <span className="text-slate-200">{formatCurrency(result.initialInstallmentFin)}</span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-blue-400">Consórcio:</span>
                                                <span className="text-slate-200">{formatCurrency(result.initialInstallmentCons)}</span>
                                            </div>
                                            <div className="flex justify-between mt-2 pt-1 border-t border-slate-700/50">
                                                <span className="text-emerald-400 font-bold">Total Mensal:</span>
                                                <span className="text-emerald-300 font-bold">{formatCurrency(result.initialInstallmentFin + result.initialInstallmentCons)}</span>
                                            </div>
                                        </div>

                                        {/* Column 2: Final Commitment */}
                                        <div className="px-2">
                                            <div className="text-xs text-slate-300 font-bold mb-2 uppercase tracking-wide text-center">
                                                Comprometimento Final <span className="text-[9px] font-normal normal-case text-slate-500">(Mês {consortium.term})</span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-red-400">Financiamento:</span>
                                                <span className="text-slate-200">{formatCurrency(result.finalInstallmentFin)}</span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-blue-400">Consórcio:</span>
                                                <span className="text-slate-200">{formatCurrency(result.finalInstallmentCons)}</span>
                                            </div>
                                            <div className="flex justify-between mt-2 pt-1 border-t border-slate-700/50">
                                                <span className="text-emerald-400 font-bold">Total Mensal:</span>
                                                <span className="text-emerald-300 font-bold">{formatCurrency(result.finalInstallmentFin + result.finalInstallmentCons)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                </div>

                {/* Legal Disclaimers (Restored) */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Avisos Legais & Isenção de Responsabilidade</h4>
                    <div className="text-[9px] text-slate-600 space-y-1 text-justify leading-relaxed">
                        <p>1. <strong>Natureza da Simulação:</strong> Esta ferramenta é apenas para fins ilustrativos e de planejamento financeiro. Os resultados apresentados são projeções baseadas nas premissas informadas e não garantem rentabilidade futura ou custos exatos.</p>
                        <p>2. <strong>Variação de Taxas:</strong> As taxas de mercado (CDI, Selic, INCC, IPCA) e os custos operacionais (Taxa de Administração, Fundo de Reserva) podem sofrer alterações ao longo do tempo de acordo com o cenário econômico e as políticas das administradoras de consórcio.</p>
                        <p>3. <strong>Contemplação:</strong> A contemplação no consórcio depende exclusivamente de sorteio ou lance vencedores nas assembleias mensais. Não há garantia de data específica para a liberação do crédito.</p>
                        <p>4. <strong>Tributação:</strong> Os cálculos de investimentos comparativos consideram a alíquota de Imposto de Renda (IR) conforme a tabela regressiva vigente na data da simulação.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
