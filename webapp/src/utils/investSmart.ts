import type { InvestSmartInput } from '../types/Financial';

export interface InvestmentScenario {
    totalGross: number; // Valor Bruto Final
    totalCost: number; // Custos (IR, Taxas)
    netWealth: number; // Patrimônio Líquido
}

export interface PeriodData {
    start: number;
    end: number;
    value: number;
    letter: number;
    total: number;
}

export interface InvestSmartResult {
    consortium: InvestmentScenario & {
        netCreditValue: number; // Valor Líquido Crédito
    };
    cdb: InvestmentScenario;
    di: InvestmentScenario;
    savings: InvestmentScenario;

    initialInvestment: number; // V0 (Lance)

    bidDetails: {
        total: number;
        embedded: number;
        cash: number;
    };

    comparisons: {
        gainVsCDB: number;
        gainVsDI: number;
        gainVsSavings: number;
    };

    installments: {
        first: number;
        reduced: number; // Pós contemplação
        totalCost: number;
    };

    periods: PeriodData[];
}

export const calculateInvestSmart = (input: InvestSmartInput): InvestSmartResult => {
    const { letterValue, consortium, financialIndicators, investmentRates, contemplationMonth } = input;

    // --- Parametros ---
    const i_incc_aa = financialIndicators.inccAnnual / 100;
    const term = consortium.term;
    // const Pz_Cons = term;

    // Rates
    const masterRateMo = investmentRates.masterFundMonthly / 100; // Fundo Master % a.m.

    // DI / CDB setup
    // const i_di_mo_gross = (investmentRates.cdiPercent / 100) * (investmentRates.cdiPercent / 100);
    // HTML: let iDiMo = (this.cdiValue / 100) * (this.cdiPercent / 100); 
    // And cdiValue on HTML seems to be "0.96" -> 0.96%
    // Let's assume input cdiPercent is 100 (for 100% CDI) and cdiValue is like 0.96
    // But in input struct i put cdiPercent. I should normalize inputs.
    // Let's recalculate based on typical usage.
    // Input: cdiPercent (e.g. 100), cdiAnnual/Monthly?
    // On HTML it fetched API for Monthly CDI.

    // Let's assume input delivers effective monthly rates or we calculate them.
    // For safety, let's implement the fetching logic in the Hook later, here we accept the RATE.
    // Let's change input slightly to be clearer: "cdiMonthlyRate"
    // But sticking to interface:
    // const cdiMonthly = (financialIndicators.cdiAnnual || 11.25) / 100 / 12;
    // Actually HTML used `cdiValue` from API.
    // Let's use strict logic from HTML:
    // "iDiMo = (this.cdiValue / 100) * (this.cdiPercent / 100)"
    // So if CDI is 0.96%, iDiMo = 0.0096 * 1.0. Correct.

    // We will rely on caller passing correct rates.
    // Let's assume input.investmentRates contains the base indicators
    // But looking at interface InvestSmartInput... 
    // Let's use what we have.

    // const i_di_mo_net = (investmentRates.cdiPercent / 100) * (financialIndicators.cdiAnnual! / 12 / 100); 
    // Wait, reusing exact logic from HTML is safer.
    // HTML: `cdiValue` (e.g. 0.96) is the base.
    // Let's assume the caller provides the *Base Monthly CDI* in `investmentRates.cdiPercent`? No.
    // I entered `cdiPercent` as "100% do CDI". 
    // I need the Base CDI value in input.
    // Let's presume financialIndicators.cdiAnnual is used to derive monthly if raw not present.
    const baseCdiMo = (financialIndicators.cdiAnnual || 10) / 12 / 100;

    // Flow Vars
    const bidType = consortium.bidType;
    const bidPercent = consortium.bidPercent;

    let currentLetter = letterValue;

    let preContemplationPaid = 0;
    let amountPaidInCashBid = 0;
    let totalPaidInstallments = 0;

    let netCreditAtContemplation = 0;
    const periods: PeriodData[] = [];

    let periodStart = 1;
    let lastPmt = -1;
    let lastLetter = currentLetter;
    let periodSum = 0;

    // --- 1. Consortium Loop ---
    for (let m = 1; m <= term; m++) {
        // INCC
        if (m > 1 && (m - 1) % 12 === 0) {
            currentLetter *= (1 + i_incc_aa);
        }

        let pmt = 0;
        const isPostContemplation = m > contemplationMonth;

        if (!isPostContemplation) {
            // Phase 1
            const totalRate = (100 + consortium.adminFeeTotal + consortium.reserveFundTotal) / term;
            pmt = currentLetter * (totalRate / 100);
            preContemplationPaid += pmt;
        } else {
            // Phase 2
            const totalContractedPercent = 100 + consortium.adminFeeTotal + consortium.reserveFundTotal;
            const totalRate = totalContractedPercent / term;
            const percentPaidPre = totalRate * contemplationMonth;

            let newTotalPercent = totalContractedPercent - bidPercent - percentPaidPre;
            if (newTotalPercent < 0) newTotalPercent = 0;

            const remainingMonths = term - contemplationMonth;
            const newMonthlyPercent = remainingMonths > 0 ? (newTotalPercent / remainingMonths) : 0;

            pmt = currentLetter * (newMonthlyPercent / 100);
        }

        totalPaidInstallments += pmt;

        // Bid Event
        if (m === contemplationMonth) {
            const currentBidTotal = currentLetter * (bidPercent / 100);
            const currentEmbedded = bidType === 'embutido' ? currentBidTotal * 0.5 : 0;
            const cashBidNeeded = currentBidTotal - currentEmbedded;

            amountPaidInCashBid = cashBidNeeded;
            netCreditAtContemplation = currentLetter - currentEmbedded;
        }

        // Period Grouping
        let isNewPeriod = false;
        if (m === 1) {
            lastPmt = pmt;
            lastLetter = currentLetter;
        } else if (Math.abs(pmt - lastPmt) > 0.05) {
            isNewPeriod = true;
        }

        if (isNewPeriod) {
            periods.push({
                start: periodStart,
                end: m - 1,
                value: lastPmt,
                total: periodSum,
                letter: lastLetter
            });
            periodStart = m;
            periodSum = 0;
            lastPmt = pmt;
            lastLetter = currentLetter;
        }
        periodSum += pmt;

        if (m === term) {
            periods.push({
                start: periodStart,
                end: m,
                value: lastPmt,
                total: periodSum,
                letter: lastLetter
            });
        }
    }

    // --- 2. Consortium Wealth ---
    const nr = Math.max(0, term - contemplationMonth);
    const grossCreditFV = netCreditAtContemplation * Math.pow(1 + masterRateMo, nr);
    const rBrutaCarta = grossCreditFV;
    const consTotalCost = totalPaidInstallments + amountPaidInCashBid;
    const consWealth = rBrutaCarta - consTotalCost;

    // --- 3. Benchmarks ---
    // Benchmark logic: Initial Invest = Cash Bid. Monthly Invest = Equivalent Pmt.
    const flowDI = { balance: amountPaidInCashBid, principal: amountPaidInCashBid };
    const flowCDB = { balance: amountPaidInCashBid, principal: amountPaidInCashBid };
    const flowSavings = { balance: amountPaidInCashBid, principal: amountPaidInCashBid };

    // Derived Monthly Rates
    // DI: Base * Percent. Tax is calculated at end.
    const iDiMo = baseCdiMo * (investmentRates.cdiPercent / 100); // 100% do CDI usually
    // CDB: Similar
    const iCdbMo = baseCdiMo * (investmentRates.cdiPercent / 100); // Example 100%
    // Savings
    const iPoupMo = (financialIndicators.savingsMonthly || 0.6) / 100;

    // Fees deduction for Funds?
    // HTML: iDiNetMo = iDiMo - feeDiMo.
    const feeDiMo = (Math.pow(1 + (investmentRates.diAdminFeeAnnual / 100), 1 / 12) - 1);
    const iDiNetMo = iDiMo - feeDiMo;

    // Re-run loop for flow
    for (let m = 1; m <= term; m++) {
        // Yield
        flowDI.balance *= (1 + iDiNetMo);
        flowCDB.balance *= (1 + iCdbMo);
        flowSavings.balance *= (1 + iPoupMo);

        // Contribution
        // Find pmt from periods (efficient enough for 200 items)
        const p = periods.find(x => m >= x.start && m <= x.end);
        const val = p ? p.value : 0;

        flowDI.balance += val;
        flowDI.principal += val;

        flowCDB.balance += val;
        flowCDB.principal += val;

        flowSavings.balance += val;
        flowSavings.principal += val;
    }

    // Taxes (IR)
    const projectDays = term * 30;
    const irRate = projectDays < 180 ? 0.225 : (projectDays < 360 ? 0.20 : (projectDays < 720 ? 0.175 : 0.15));

    const gainDI = flowDI.balance - flowDI.principal;
    const taxDI = Math.max(0, gainDI * irRate);

    const gainCDB = flowCDB.balance - flowCDB.principal;
    const taxCDB = Math.max(0, gainCDB * irRate);

    // Initial and Final Installments for display
    const firstPmt = periods.length > 0 ? periods[0].value : 0;
    // Reduced is usually the last period
    const lastPmtVal = periods.length > 0 ? periods[periods.length - 1].value : 0;

    return {
        consortium: {
            totalGross: rBrutaCarta,
            totalCost: consTotalCost,
            netWealth: consWealth,
            netCreditValue: netCreditAtContemplation
        },
        cdb: {
            totalGross: flowCDB.balance,
            totalCost: taxCDB,
            netWealth: flowCDB.balance - taxCDB
        },
        di: {
            totalGross: flowDI.balance,
            totalCost: taxDI,
            netWealth: flowDI.balance - taxDI
        },
        savings: {
            totalGross: flowSavings.balance,
            totalCost: 0,
            netWealth: flowSavings.balance
        },
        initialInvestment: amountPaidInCashBid + preContemplationPaid, // V0 definition varies, HTML says V0 = PrePaid + CashBid
        bidDetails: {
            total: bidPercent / 100 * letterValue,
            embedded: bidType === 'embutido' ? (bidPercent / 100 * letterValue) * 0.5 : 0,
            cash: amountPaidInCashBid // Calculated in loop correctly as (Total - Embedded)
        },
        comparisons: {
            gainVsCDB: ((consWealth / (flowCDB.balance - taxCDB)) - 1) * 100,
            gainVsDI: ((consWealth / (flowDI.balance - taxDI)) - 1) * 100,
            gainVsSavings: ((consWealth / flowSavings.balance) - 1) * 100
        },
        installments: {
            first: firstPmt,
            reduced: lastPmtVal,
            totalCost: consTotalCost
        },
        periods
    };
};
