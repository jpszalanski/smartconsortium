import type { QuitaSmartInput } from '../types/Financial';

export interface QuitaSmartResult {
    economy: number;
    avoidedInterest: number;
    futureDebtBalance: number;
    futureLetterValue: number;
    totalCostOriginal: number;
    totalCostStrategy: number;
    interestPaidUntilQuit: number;
    consortiumFees: number;
    requiredLetter: number;
    initialInstallmentFin: number;
    initialInstallmentCons: number;
    finalInstallmentFin: number;
    finalInstallmentCons: number;
    evolutionChart: {
        debtBalance: number[];
        letterValue: number[];
    };
    monthlyFlowChart: {
        finPmt: number[];
        consPmt: number[];
    };
}

export const calculateQuitaSmart = (input: QuitaSmartInput): QuitaSmartResult => {
    const { financing, consortium } = input;

    const SD = financing.totalValue;
    const Pz_Total = financing.totalTerm;
    const Paid = financing.paidInstallments || 0;

    const Pz_Fin = financing.type === 'andamento'
        ? Math.max(1, Pz_Total - Paid)
        : Pz_Total;

    const Pz_Cons = consortium.term;

    const i_fin_aa = financing.interestRateAnnual / 100;
    const i_incc_aa = financing.inccAnnual / 100;

    // 1. Correção e Saldo Devedor Futuro
    // Formula V8 adaptation
    const N_ciclo = 12;
    const T_correcao = Math.floor(Pz_Cons / N_ciclo);

    let SD_fq = SD * (1 - (Pz_Cons / Pz_Fin));
    if (SD_fq < 0) SD_fq = 0;

    // 2. Carta Necessária
    const correctionFactor = Math.pow(1 + i_incc_aa, T_correcao);
    const Carta_a_Raw = SD_fq / correctionFactor;
    // Arredondamento mercado (500)
    const Carta_a = Math.ceil(Carta_a_Raw / 500) * 500;

    // 3. Custos Financiamento (Simulação SAC)
    const i_fin_am = Math.pow(1 + i_fin_aa, 1 / 12) - 1;
    const Amort_SAC = SD / Pz_Fin;

    let totalJurosFin_Original = 0;
    let totalJurosFin_AteT = 0;

    const saldoFinArray: number[] = [];
    const pmtFinArray: number[] = [];
    let currentSaldo = SD;

    for (let m = 0; m <= Pz_Fin; m++) {
        saldoFinArray.push(Math.max(0, currentSaldo));

        if (m < Pz_Fin) {
            const Juros = currentSaldo * i_fin_am;
            const PMT = Amort_SAC + Juros;

            pmtFinArray.push(PMT);

            totalJurosFin_Original += Juros;
            if (m < Pz_Cons) {
                totalJurosFin_AteT += Juros;
            }
            currentSaldo -= Amort_SAC;
        }
    }

    // 4. Custos Consórcio
    const cartaArray: number[] = [];
    const pmtConsArray: number[] = [];
    let totalTaxasConsorcio = 0;

    let currentCarta = Carta_a;
    const feeRateTotal = consortium.adminFeeTotal + consortium.reserveFundTotal;
    const monthlyFeeRate = feeRateTotal / Pz_Cons;
    const monthlyFundRate = 100 / Pz_Cons;

    for (let m = 0; m <= Pz_Cons; m++) {
        if (m > 0 && m % 12 === 0) {
            currentCarta = currentCarta * (1 + i_incc_aa);
        }
        cartaArray.push(currentCarta);

        if (m < Pz_Cons) {
            const pmtFund = currentCarta * (monthlyFundRate / 100);
            const pmtFees = currentCarta * (monthlyFeeRate / 100);
            const pmtTotal = pmtFund + pmtFees;

            pmtConsArray.push(pmtTotal);
            totalTaxasConsorcio += pmtFees;
        }
    }

    const Economy = totalJurosFin_Original - (totalJurosFin_AteT + totalTaxasConsorcio);

    return {
        economy: Economy,
        avoidedInterest: totalJurosFin_Original - totalJurosFin_AteT,
        futureDebtBalance: SD_fq,
        futureLetterValue: cartaArray[Pz_Cons] || 0,
        totalCostOriginal: totalJurosFin_Original,
        totalCostStrategy: totalJurosFin_AteT + totalTaxasConsorcio,
        interestPaidUntilQuit: totalJurosFin_AteT,
        consortiumFees: totalTaxasConsorcio,
        requiredLetter: Carta_a,
        initialInstallmentFin: pmtFinArray[0] || 0,
        initialInstallmentCons: pmtConsArray[0] || 0,
        finalInstallmentFin: pmtFinArray[Pz_Cons - 1] || 0,
        finalInstallmentCons: pmtConsArray[Pz_Cons - 1] || 0,
        evolutionChart: {
            debtBalance: saldoFinArray,
            letterValue: cartaArray // Needs padding in UI
        },
        monthlyFlowChart: {
            finPmt: pmtFinArray,
            consPmt: pmtConsArray
        }
    };
};
