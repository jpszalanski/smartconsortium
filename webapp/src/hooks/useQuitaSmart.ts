import { useState, useMemo } from 'react';
import type { FinancingInput, QuitaSmartInput } from '../types/Financial';
import { calculateQuitaSmart } from '../utils/quitaSmart';

export const useQuitaSmart = () => {
    const [financing, setFinancing] = useState<FinancingInput>({
        type: 'novo',
        totalValue: 500000,
        totalTerm: 420,
        paidInstallments: 0,
        interestRateAnnual: 10.74,
        inccAnnual: 6.0
    });

    const [consortium, setConsortium] = useState({
        term: 200,
        adminFeeTotal: 20.0,
        reserveFundTotal: 5.5
    });

    const updateFinancing = (field: keyof FinancingInput, value: any) => {
        setFinancing(prev => ({ ...prev, [field]: value }));
    };

    const updateConsortium = (field: keyof typeof consortium, value: any) => {
        setConsortium(prev => ({ ...prev, [field]: value }));
    };

    const result = useMemo(() => {
        // Validation
        if (financing.totalValue <= 0 || financing.totalTerm <= 0) return null;

        const input: QuitaSmartInput = {
            financing,
            consortium
        };

        return calculateQuitaSmart(input);
    }, [financing, consortium]);

    return {
        financing,
        consortium,
        updateFinancing,
        updateConsortium,
        result
    };
};
