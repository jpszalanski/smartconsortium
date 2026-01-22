import { useState, useEffect, useMemo } from 'react';
import type { InvestSmartInput } from '../types/Financial';
import { calculateInvestSmart } from '../utils/investSmart';

export const useInvestSmart = () => {
    // State
    const [letterValue, setLetterValue] = useState(500000);
    const [consortium, setConsortium] = useState({
        term: 200,
        adminFeeTotal: 20,
        reserveFundTotal: 5.5,
        bidType: 'embutido' as 'livre' | 'embutido',
        bidPercent: 70
    });

    const [indicators, setIndicators] = useState({
        inccAnnual: 5.5,
        cdiAnnual: 11.25, // Display/Fallback
        savingsMonthly: 0.6
    });

    const [rates, setRates] = useState({
        masterFundMonthly: 1.00,
        masterAdminFeeAnnual: 1.50,
        diAdminFeeAnnual: 1.5,
        cdiPercent: 90 // % do CDI
    });

    const [cdiBaseMonthly, setCdiBaseMonthly] = useState(0.96); // Valor base CDI mensal

    const [contemplationMonth, setContemplationMonth] = useState(1);


    const fetchIndicators = async () => {
        const getCurrentMonthYear = () => {
            const now = new Date();
            return `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        };

        const getSafeValue = (data: any[], _label: string) => {
            if (!data || data.length === 0) return null;
            const currentMY = getCurrentMonthYear();
            let validItem = null;

            for (let i = data.length - 1; i >= 0; i--) {
                const item = data[i];
                const parts = item.data.split('/');
                if (parts.length === 3) {
                    const itemMY = `${parts[1]}/${parts[2]}`;
                    if (itemMY !== currentMY) {
                        validItem = item;
                        break;
                    }
                }
            }
            if (!validItem) validItem = data[data.length - 1];
            return parseFloat(validItem.valor);
        };

        try {
            // Poupanca (Serie 195)
            const resPoup = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/6?formato=json');
            const dataPoup = await resPoup.json();
            const lastPoup = getSafeValue(dataPoup, 'Poupanca');

            // CDI (Serie 4390)
            const resCDI = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados/ultimos/6?formato=json');
            const dataCDI = await resCDI.json();
            const lastCDI = getSafeValue(dataCDI, 'CDI');

            setIndicators(prev => ({
                ...prev,
                savingsMonthly: lastPoup || 0.6,
                cdiAnnual: lastCDI
                    ? (Math.pow(1 + lastCDI / 100, 12) - 1) * 100
                    : 11.25
            }));

            if (lastCDI) {
                setCdiBaseMonthly(lastCDI);
                setRates(prev => ({ ...prev, masterFundMonthly: parseFloat((lastCDI * 1.03).toFixed(2)) }));
            }

        } catch (err) {
            console.warn("Failed to fetch indicators", err);
        }
    };

    // Fetch Data on Mount
    useEffect(() => {
        fetchIndicators();
    }, []);

    const result = useMemo(() => {
        const input: InvestSmartInput = {
            letterValue,
            consortium: {
                term: consortium.term,
                adminFeeTotal: consortium.adminFeeTotal,
                reserveFundTotal: consortium.reserveFundTotal,
                bidType: consortium.bidType,
                bidPercent: consortium.bidPercent
            },
            financialIndicators: {
                inccAnnual: indicators.inccAnnual,
                cdiAnnual: cdiBaseMonthly * 12, // Logic in util divides by 12, so this preserves the monthly base
                savingsMonthly: indicators.savingsMonthly
            },
            investmentRates: {
                masterFundMonthly: rates.masterFundMonthly,
                masterAdminFeeAnnual: rates.masterAdminFeeAnnual,
                diAdminFeeAnnual: rates.diAdminFeeAnnual,
                cdiPercent: rates.cdiPercent
            },
            contemplationMonth
        };
        return calculateInvestSmart(input);
    }, [letterValue, consortium, indicators.inccAnnual, indicators.savingsMonthly, cdiBaseMonthly, rates, contemplationMonth]);

    const updateConsortium = (field: keyof typeof consortium, value: any) => {
        setConsortium(prev => ({ ...prev, [field]: value }));
    };

    return {
        letterValue, setLetterValue,
        consortium, updateConsortium,
        indicators, setIndicators,
        rates, setRates,
        cdiBaseMonthly, setCdiBaseMonthly,
        contemplationMonth, setContemplationMonth,
        result,
        fetchData: fetchIndicators
    };
};
