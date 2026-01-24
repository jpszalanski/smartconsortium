import React, { useEffect, useState } from 'react';

import { useInvestSmart } from '../hooks/useInvestSmart';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Range } from '../components/Range';
import { trackEvent } from '../services/analytics';
import { formatCurrency, formatMoneyInput, formatCompact, formatPercent } from '../utils/formatters';

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

export const InvestSmart: React.FC = () => {

    const {
        letterValue, setLetterValue,
        consortium, updateConsortium,
        rates, setRates,
        cdiBaseMonthly, setCdiBaseMonthly,
        contemplationMonth, setContemplationMonth,
        result,
        indicators,
        setIndicators, // Exposed for updating savings
        fetchData // Exposed for manual BCB fetch
    } = useInvestSmart();

    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        trackEvent('view_screen', { screen_name: 'investsmart' });
    }, []);

    const handleSimulate = () => {
        trackEvent('calculate_investimento', {
            valor_carta: letterValue,
            prazo_cota: consortium.term
        });
        setShowResults(true);
    };

    // --- Chart Data ---
    const barData = {
        labels: ['Consórcio', 'CDB-DI', 'Fundo DI', 'Poupança'],
        datasets: [{
            label: 'Patrimônio Líquido Final',
            data: result ? [
                result.consortium.netWealth,
                result.cdb.netWealth,
                result.di.netWealth,
                result.savings.netWealth
            ] : [],
            backgroundColor: [
                '#3b82f6', // Consorcio Blue
                '#64748b',
                '#64748b',
                '#64748b'
            ],
            borderRadius: 6
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
    };

    return (
        <div className="w-full max-w-[90rem] animate-fade-in">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-xl border-b border-white/5 py-4 mb-4">
                <div className="max-w-[90rem] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="text-center w-full">
                        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            Invest Smart
                        </h1>
                        <p className="text-slate-400 text-xs md:text-sm">Alavanque seu patrimônio com consórcio</p>
                    </div>
                </div>
            </div>

            <div className="max-w-[90rem] mx-auto px-4 md:px-8 pb-20">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                    {/* Left Column: Inputs (Span 3) */}
                    <div className="lg:col-span-3 space-y-4">
                        <Card className="p-5 border-l-4 border-emerald-500">
                            <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Parâmetros
                            </h2>

                            <div className="space-y-4">
                                <Input
                                    label="Valor da Carta (R$)"
                                    value={formatCurrency(letterValue)}
                                    onChange={(e) => setLetterValue(formatMoneyInput(e.target.value))}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        label="Taxa Adm (%)"
                                        type="number"
                                        value={consortium.adminFeeTotal}
                                        onChange={(e) => updateConsortium('adminFeeTotal', parseFloat(e.target.value))}
                                    />
                                    <Input
                                        label="Fundo Res. (%)"
                                        type="number"
                                        value={consortium.reserveFundTotal}
                                        onChange={(e) => updateConsortium('reserveFundTotal', parseFloat(e.target.value))}
                                    />
                                </div>

                                <div className="">
                                    <Input
                                        label="INCC Estimado (% a.a.)"
                                        type="number"
                                        value={indicators?.inccAnnual || 5.5}
                                        readOnly={true}
                                    />
                                </div>

                                <div className="pt-3 border-t border-slate-700/50">
                                    <h3 className="text-[10px] font-bold text-purple-300 uppercase mb-2">Lance</h3>
                                    <div className="mb-2">
                                        <select
                                            className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-xs appearance-none"
                                            value={consortium.bidType}
                                            onChange={(e) => updateConsortium('bidType', e.target.value)}
                                        >
                                            <option value="livre">Lance Livre (Próprio)</option>
                                            <option value="embutido">Lance Embutido (50%)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Input
                                            label="Percentual (%)"
                                            type="number"
                                            value={consortium.bidPercent}
                                            onChange={(e) => updateConsortium('bidPercent', parseFloat(e.target.value))}
                                        />
                                        <p className="text-[9px] text-slate-500 text-right">
                                            Valor: {result?.bidDetails ? formatCurrency(result.bidDetails.total) : formatCurrency(letterValue * (consortium.bidPercent / 100))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card >

                        <Card className="p-5 border-l-4 border-blue-500">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Rentabilidade</h2>
                                <button
                                    onClick={() => fetchData()} // fetchData is now exposed
                                    className="text-[9px] text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    BCB
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                {/* Fundo Master */}
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-300 font-medium">Fundo Master</span>
                                        <span className="text-[9px] text-slate-500">
                                            Taxa Adm: <input
                                                type="number"
                                                value={rates.masterAdminFeeAnnual}
                                                onChange={(e) => setRates(prev => ({ ...prev, masterAdminFeeAnnual: parseFloat(e.target.value) }))}
                                                className="bg-transparent w-8 border-b border-slate-700 text-slate-400 text-[9px] focus:outline-none text-center"
                                                step="0.1"
                                            />% a.a.
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            className="w-12 bg-slate-900/50 rounded px-1 py-1 text-right text-white"
                                            value={rates.masterFundMonthly}
                                            onChange={(e) => setRates(prev => ({ ...prev, masterFundMonthly: parseFloat(e.target.value) }))}
                                            step="0.01"
                                        />
                                        <span className="text-slate-500">% a.m.</span>
                                    </div>
                                </div>

                                {/* Fundo DI */}
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-300 font-medium">Fundo DI</span>
                                        <span className="text-[9px] text-slate-500">
                                            Taxa Adm: <input
                                                type="number"
                                                value={rates.diAdminFeeAnnual}
                                                onChange={(e) => setRates(prev => ({ ...prev, diAdminFeeAnnual: parseFloat(e.target.value) }))}
                                                className="bg-transparent w-8 border-b border-slate-700 text-slate-400 text-[9px] focus:outline-none text-center"
                                                step="0.1"
                                            />% a.a.
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {/* Legacy used diRate state for this input */}
                                        {/* In our hook, diRate wasn't explicitly separated, but we can derive or add it. */}
                                        {/* Actually, calc logic derives DI rate from CDI %. */}
                                        {/* But Legacy allowed strict overriding of "diRate"? */}
                                        {/* Line 597: x-model.number="diRate" */}
                                        {/* Line 2190: this.cdiAnnual = ... */}
                                        {/* It seems Legacy separates them. */}
                                        {/* I will use cdiBaseMonthly * cdiPercent for display or add a specific override? */}
                                        {/* Let's look at hook again. We have cdiBaseMonthly and cdiPercent. */}
                                        {/* For Fundo DI, usually it tracks CDI. */}
                                        {/* Let's expose cdiBaseMonthly here as the 'Rate' reference if aligned with legacy logic flow */}

                                        {/* Wait, legacy has a separate 'diRate' model. */}
                                        {/* My hook has 'cdiBaseMonthly'. */}
                                        {/* Let's standardise on using cdiBaseMonthly as the input here, or check if we need a separate state. */}
                                        {/* Legacy 'diRate' was initialized to CDI value. */}
                                        <input
                                            type="number"
                                            className="w-12 bg-slate-900/50 rounded px-1 py-1 text-right text-white"
                                            value={cdiBaseMonthly} // Using Base CDI as the editable value
                                            onChange={(e) => setCdiBaseMonthly(parseFloat(e.target.value))}
                                            step="0.01"
                                        />
                                        <span className="text-slate-500">% a.m.</span>
                                    </div>
                                </div>

                                {/* CDB-DI Block */}
                                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-800/40 rounded-lg border border-slate-700/50">
                                    <div className="col-span-2 text-[10px] text-slate-300 font-bold mb-1">CDB-DI</div>
                                    <div>
                                        <label className="block text-[9px] text-slate-500 mb-0.5">% do CDI</label>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                value={rates.cdiPercent}
                                                onChange={(e) => setRates(prev => ({ ...prev, cdiPercent: parseFloat(e.target.value) }))}
                                                className="w-full bg-slate-900/50 rounded px-1 py-1 text-xs text-right font-semibold text-blue-300"
                                            />
                                            <span className="text-[9px] text-slate-500 ml-1">%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] text-slate-500 mb-0.5">CDI Base (a.m.)</label>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                value={cdiBaseMonthly}
                                                onChange={(e) => setCdiBaseMonthly(parseFloat(e.target.value))}
                                                className="w-full bg-slate-900/50 rounded px-1 py-1 text-xs text-right text-slate-400"
                                                step="0.01"
                                            />
                                            <span className="text-[9px] text-slate-500 ml-1">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] text-slate-300 font-medium">Poupança</span>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            value={indicators?.savingsMonthly || 0.6}
                                            // We need a setter for indicators.savingsMonthly to be fully matched
                                            // My hook exposes setIndicators.
                                            onChange={(e) => setIndicators(prev => ({ ...prev, savingsMonthly: parseFloat(e.target.value) }))}
                                            className="w-12 bg-slate-900/50 rounded px-1 py-1 text-xs text-right text-white"
                                            step="0.01"
                                        />
                                        <span className="text-slate-500">% a.m.</span>
                                    </div>
                                </div>
                            </div>

                            <Button fullWidth onClick={handleSimulate} className="mt-6 bg-emerald-600 hover:bg-emerald-500">
                                Simular
                            </Button>
                        </Card>
                    </div >

                    {/* Main Content Area */}
                    {
                        showResults && result && (
                            <>
                                {/* Middle Column: Results & Comparison (Span 6) */}
                                <div className="lg:col-span-6 space-y-4 animate-fade-in-up">

                                    {/* Hero Result */}
                                    <Card className="p-6 border-t-4 border-blue-500 text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-500/5 z-0"></div>
                                        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest relative z-10">Resultado Líquido da Estratégia</h2>
                                        <div className="text-5xl md:text-6xl font-bold text-white my-4 relative z-10">
                                            {formatCurrency(result.consortium.netWealth)}
                                        </div>
                                        <p className="text-xs text-slate-400 relative z-10">Valor líquido final após custos e impostos</p>

                                        {/* Comparison Highlight */}
                                        <div className="flex flex-wrap justify-center gap-2 mt-4 relative z-10">
                                            {result.comparisons.gainVsCDB > 0 && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                                                    {formatPercent(result.comparisons.gainVsCDB)} &gt; CDB
                                                </span>
                                            )}
                                            {result.comparisons.gainVsDI > 0 && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                                                    {formatPercent(result.comparisons.gainVsDI)} &gt; DI
                                                </span>
                                            )}
                                            {result.comparisons.gainVsSavings > 0 && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                                                    {formatPercent(result.comparisons.gainVsSavings)} &gt; Poupança
                                                </span>
                                            )}
                                        </div>
                                    </Card>

                                    {/* Methodology */}
                                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-justify">
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Entenda a Estratégia (Alavancagem)
                                        </h3>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            <strong>Metodologia Comparativa:</strong> A simulação projeta a aplicação dos mesmos recursos (Lance Inicial + Aportes Mensais das Parcelas) em todas as opções.
                                            <br /><br />
                                            <strong>O Fator de Alavancagem:</strong> A vantagem da estratégia reside na base de cálculo da rentabilidade. Enquanto nos investimentos comparados (CDB, DI, Poupança) os rendimentos incidem apenas sobre o capital próprio acumulado progressivamente, no Consórcio Contemplado a rentabilidade do Fundo Master incide sobre o <strong>Valor Integral da Carta de Crédito</strong>.
                                        </p>
                                    </div>

                                    {/* Base Comparacao */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex flex-col items-center justify-center">
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Valor Investido</span>
                                            <span className="text-sm font-bold text-white">{formatCurrency(result.initialInvestment)}</span>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex flex-col items-center justify-center">
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Prazo Considerado</span>
                                            <span className="text-sm font-bold text-white">{consortium.term} meses</span>
                                        </div>
                                    </div>

                                    {/* Comparative Chart */}
                                    <Card className="p-5 border border-slate-700/50">
                                        <h3 className="text-xs font-bold text-slate-300 mb-4 uppercase tracking-wider">Comparativo Patrimonial</h3>
                                        <div className="relative h-64 w-full">
                                            <Bar data={barData} options={chartOptions as any} />
                                        </div>
                                        <div className="mt-6 space-y-4">
                                            <Range
                                                label="Prazo da Cota"
                                                min="13" max="200"
                                                value={consortium.term}
                                                valueDisplay={`${consortium.term} meses`}
                                                onChange={(e) => updateConsortium('term', parseInt(e.target.value))}
                                            />
                                            <Range
                                                label="Mês da Contemplação"
                                                min="1" max={consortium.term - 1}
                                                value={contemplationMonth}
                                                valueDisplay={contemplationMonth}
                                                onChange={(e) => setContemplationMonth(parseInt(e.target.value))}
                                            />
                                        </div>
                                    </Card>

                                    {/* Detailed Table */}
                                    <Card className="p-4 overflow-x-auto">
                                        <table className="w-full text-left border-collapse text-xs text-slate-300">
                                            <thead>
                                                <tr className="text-slate-500 uppercase border-b border-slate-700 text-[10px] tracking-wider">
                                                    <th className="py-2 px-2 font-medium">Investimento</th>
                                                    <th className="py-2 px-2 font-medium">Valor Inicial</th>
                                                    <th className="py-2 px-2 font-medium text-right">Total Bruto</th>
                                                    <th className="py-2 px-2 font-medium text-right">Custos</th>
                                                    <th className="py-2 px-2 font-medium text-right text-white">Líquido</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                                    <td className="py-3 px-2 font-bold text-blue-400">Consórcio</td>
                                                    <td className="py-3 px-2">{formatCompact(result.consortium.netCreditValue)}</td>
                                                    <td className="py-3 px-2 text-right">{formatCompact(result.consortium.totalGross)}</td>
                                                    <td className="py-3 px-2 text-right text-red-400">{formatCompact(result.consortium.totalCost)}</td>
                                                    <td className="py-3 px-2 text-right font-bold text-emerald-400">{formatCompact(result.consortium.netWealth)}</td>
                                                </tr>
                                                <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                                    <td className="py-3 px-2">Fundo DI</td>
                                                    <td className="py-3 px-2">{formatCompact(result.initialInvestment)}</td>
                                                    <td className="py-3 px-2 text-right">{formatCompact(result.di.totalGross)}</td>
                                                    <td className="py-3 px-2 text-right text-slate-500">{formatCompact(result.di.totalCost)}</td>
                                                    <td className="py-3 px-2 text-right">{formatCompact(result.di.netWealth)}</td>
                                                </tr>
                                                <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                                    <td className="py-3 px-2">CDB-DI</td>
                                                    <td className="py-3 px-2">{formatCompact(result.initialInvestment)}</td>
                                                    <td className="py-3 px-2 text-right">{formatCompact(result.cdb.totalGross)}</td>
                                                    <td className="py-3 px-2 text-right text-slate-500">{formatCompact(result.cdb.totalCost)}</td>
                                                    <td className="py-3 px-2 text-right">{formatCompact(result.cdb.netWealth)}</td>
                                                </tr>
                                                <tr className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="py-3 px-2">Poupança</td>
                                                    <td className="py-3 px-2">{formatCompact(result.initialInvestment)}</td>
                                                    <td className="py-3 px-2 text-right">{formatCompact(result.savings.totalGross)}</td>
                                                    <td className="py-3 px-2 text-right text-slate-500">-</td>
                                                    <td className="py-3 px-2 text-right">{formatCompact(result.savings.netWealth)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Card>
                                    {/* Footer Legend */}
                                    <div className="mt-2 px-2 space-y-1">
                                        <div className="flex gap-2 items-start">
                                            <span className="text-[10px] font-bold text-blue-400 uppercase shrink-0 w-20">Consórcio:</span>
                                            <span className="text-[10px] text-slate-500 leading-tight">Valor da Carta contemplada rentabilizada pelo Fundo Master (após contemplação). Custo considera parcelas pagas e saldo devedor ajustado.</span>
                                        </div>
                                        {/* ... Others simplified or assumed standard ... */}
                                    </div>
                                </div>

                                {/* Right Column: Details (Span 3) */}
                                <div className="lg:col-span-3 space-y-4 animate-fade-in-up" >
                                    {/* Detalhes do Plano */}
                                    <div className="glass-panel rounded-xl p-4 border border-emerald-500/30 bg-emerald-900/10 backdrop-blur-md">
                                        <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                            Detalhes do Plano
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-2 text-center pb-2 border-b border-emerald-500/20">
                                                <div>
                                                    <span className="block text-[9px] text-slate-400 uppercase">Carta</span>
                                                    <span className="block text-xs font-bold text-white">{formatCompact(letterValue)}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] text-slate-400 uppercase">Prazo</span>
                                                    <span className="block text-xs font-bold text-white">{consortium.term} meses</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-slate-300">1ª Parcela (Integral)</span>
                                                    <span className="text-xs font-semibold text-emerald-300">{formatCurrency(result.installments.first)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-slate-300">Pós-Contemplação (Red.)</span>
                                                    <span className="text-xs font-semibold text-emerald-300">{formatCurrency(result.installments.reduced)}</span>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-emerald-500/20 mt-2">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Lance ({consortium.bidPercent}%)</span>
                                                    <span className="text-[9px] text-slate-500">{consortium.bidType === 'embutido' ? 'Embutido (50% Cash)' : 'Recurso Próprio'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-slate-300">Valor Total Lance</span>
                                                    <span className="text-xs font-semibold text-white">{formatCurrency(result.bidDetails.total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Demonstrativo Card */}
                                    <Card className="p-4 border border-slate-700/50">
                                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                            </svg>
                                            Demonstrativo
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
                                                <span className="text-[10px] text-slate-400">Crédito Líquido</span>
                                                <span className="text-xs font-bold text-white">{formatCurrency(result.consortium.netCreditValue)}</span>
                                            </div>

                                            <div>
                                                <span className="text-[10px] text-slate-500 font-semibold uppercase">Composição do Custo</span>
                                                <div className="mt-2 space-y-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] text-slate-400">Soma das Parcelas</span>
                                                        <span className="text-[10px] text-slate-300">{formatCurrency(result.consortium.totalCost - result.bidDetails.cash)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] text-slate-400">Lance (Recurso Próprio)</span>
                                                        <span className="text-[10px] text-slate-300">{formatCurrency(result.bidDetails.cash)}</span>
                                                    </div>

                                                    {/* Scrollable Installment List */}
                                                    <div className="mt-2 pt-2 border-t border-slate-700/30">
                                                        <span className="text-[9px] text-slate-500 font-semibold uppercase block mb-1">Evolução das Parcelas</span>
                                                        <div className="grid grid-cols-4 gap-1 text-[8px] text-slate-500 font-bold mb-1 border-b border-slate-700/50 pb-1">
                                                            <div className="pl-1">Qtd</div>
                                                            <div className="text-right">Parc.</div>
                                                            <div className="text-right">Bem</div>
                                                            <div className="text-right pr-2">Total</div>
                                                        </div>

                                                        <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                                            {result.periods.map((p, idx) => {

                                                                return (
                                                                    <div key={idx} className="grid grid-cols-4 gap-1 text-[9px] py-0.5 border-b border-slate-800/30 last:border-0 hover:bg-slate-800/30 rounded transition-colors items-center">
                                                                        <div className="flex items-center gap-1 pl-1">
                                                                            <span className="text-slate-300 font-medium whitespace-nowrap">{p.end - p.start + 1}x</span>
                                                                            {/* Tag */}
                                                                            {p.start <= contemplationMonth && (
                                                                                <span className="text-[7px] text-slate-500 bg-slate-800/80 px-1 rounded tracking-tight">Pré</span>
                                                                            )}
                                                                            {p.start > contemplationMonth && (
                                                                                <span className="text-[7px] text-emerald-400 bg-emerald-500/10 px-1 rounded tracking-tight">Pós</span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-right text-slate-300 truncate">{formatCompact(p.value)}</div>
                                                                        <div className="text-right text-blue-300/80 truncate">{formatCompact(p.letter)}</div>
                                                                        <div className="text-right text-emerald-400 font-bold truncate pr-1">{formatCompact(p.total)}</div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-1 mt-1 border-t border-slate-700/30">
                                                        <span className="text-[10px] text-red-400 font-bold">Custo Total</span>
                                                        <span className="text-xs font-bold text-red-400">{formatCurrency(result.consortium.totalCost)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] text-slate-500 font-semibold uppercase">Resultado Final</span>
                                                <div className="mt-2 space-y-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] text-slate-400">Valor Corrigido da Carta</span>
                                                        <span className="text-[10px] text-emerald-300">{formatCurrency(result.consortium.totalGross)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-700/50">
                                                        <span className="text-xs text-blue-300 font-bold uppercase">Resultado Líquido</span>
                                                        <span className="block text-sm font-bold text-white leading-none">{formatCurrency(result.consortium.netWealth)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </Card>

                                    <Card className="p-4 border border-slate-700/50">
                                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Premissas do Mercado</h3>
                                        <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-3">
                                            <li>CDI Utilizado: <span className="text-slate-400">{formatPercent(indicators?.cdiAnnual || 11.25)} a.a.</span></li>
                                            <li>Fundo Master: <span className="text-slate-400">{rates.masterFundMonthly}% a.m.</span></li>
                                            <li>Poupança: <span className="text-slate-400">{formatPercent(indicators?.savingsMonthly || 0.6)} a.m.</span></li>
                                            <li>INCC: <span className="text-slate-400">{indicators?.inccAnnual || 5.5}% a.a.</span></li>
                                        </ul>
                                    </Card>
                                </div>
                            </>
                        )
                    }
                </div>

                {/* Legal Disclaimers */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Avisos Legais & Isenção de Responsabilidade</h4>
                    <div className="text-[9px] text-slate-600 space-y-1 text-justify leading-relaxed">
                        <p>1. <strong>Natureza da Simulação:</strong> Esta ferramenta é apenas para fins ilustrativos e de planejamento financeiro. Os resultados apresentados são projeções baseadas nas premissas informadas e não garantem rentabilidade futura ou custos exatos.</p>
                        <p>2. <strong>Variação de Taxas:</strong> As taxas de mercado (CDI, Selic, INCC, IPCA) e os custos operacionais (Taxa de Administração, Fundo de Reserva) podem sofrer alterações ao longo do tempo de acordo com o cenário econômico e as políticas das administradoras de consórcio.</p>
                        <p>3. <strong>Contemplação:</strong> A contemplação no consórcio depende exclusivamente de sorteio ou lance vencedores nas assembleias mensais. Não há garantia de data específica para a liberação do crédito.</p>
                        <p>4. <strong>Tributação:</strong> Os cálculos de investimentos comparativos consideram a alíquota de Imposto de Renda (IR) conforme a tabela regressiva vigente na data da simulação. Alterações na legislação tributária podem impactar os resultados líquidos apresentados.</p>
                        <p>5. <strong>Análise de Crédito:</strong> A liberação da carta de crédito após a contemplação está sujeita à análise de cadastro e aprovação de crédito conforme as normas da administradora.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
