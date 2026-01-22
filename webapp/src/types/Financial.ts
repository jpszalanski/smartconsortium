export interface FinancingInput {
    type: 'novo' | 'andamento';
    totalValue: number; // Saldo Devedor ou Valor Total
    totalTerm: number; // Prazo total em meses
    paidInstallments: number; // Apenas para 'andamento'
    interestRateAnnual: number;
    inccAnnual: number;
}

export interface ConsortiumInput {
    term: number;
    adminFeeTotal: number;
    reserveFundTotal: number;
    bidPercent: number; // Usado no InvestSmart, pode ser útil padronizar
    bidType: 'livre' | 'embutido';
}

export interface QuitaSmartInput {
    financing: FinancingInput;
    consortium: {
        term: number;
        adminFeeTotal: number;
        reserveFundTotal: number;
    };
}

export interface InvestSmartInput {
    letterValue: number;
    consortium: ConsortiumInput;
    financialIndicators: {
        inccAnnual: number;
        selicAnnual?: number;
        cdiAnnual?: number;
        savingsMonthly?: number;
        cdiMonthly?: number;
    };
    investmentRates: {
        masterFundMonthly: number;
        masterAdminFeeAnnual: number;
        diAdminFeeAnnual: number;
        cdiPercent: number; // e.g. 100% do CDI
    };
    contemplationMonth: number;
}
