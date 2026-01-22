export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

export const formatCompact = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        notation: "compact",
        maximumFractionDigits: 1,
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

export const formatPercent = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

export const parseMoneyInput = (value: string): number => {
    const clean = value.replace(/\D/g, '');
    return (parseInt(clean) || 0) / 100;
};

export const formatMoneyInput = parseMoneyInput;
