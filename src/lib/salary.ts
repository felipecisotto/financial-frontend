import {
  SalaryEntryResponse,
  SalaryEntryGrouped,
  SalarySummaryResponse,
  SalaryCalculation,
  ENTRY_CATEGORY_LABELS,
} from "@/types/salary";

/**
 * Agrupa entries por tipo (adições e descontos)
 */
export function groupEntriesByType(entries: SalaryEntryResponse[]): SalaryEntryGrouped {
  return {
    additions: entries.filter((e) => e.entryType === "addition"),
    discounts: entries.filter((e) => e.entryType === "discount"),
  };
}

/**
 * Retorna o label em português para uma categoria
 */
export function getCategoryLabel(category: string): string {
  return ENTRY_CATEGORY_LABELS[category] || category;
}

/**
 * Formata valor em moeda brasileira (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Calcula valores detalhados do salário
 */
export function calculateSalary(summary: SalarySummaryResponse): SalaryCalculation {
  return {
    gross: summary.baseAmount + summary.totalAdditions,
    additions: summary.totalAdditions,
    discounts: summary.totalDiscounts,
    net: summary.netAmount,
  };
}

/**
 * Retorna o nome do mês em português
 */
export function getMonthName(month: number): string {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return months[month - 1] || "";
}

/**
 * Retorna o nome abreviado do mês em português
 */
export function getMonthShortName(month: number): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return months[month - 1] || "";
}

/**
 * Formata referência de mês/ano (ex: "Dezembro/2024")
 */
export function formatMonthYear(month: number, year: number): string {
  return `${getMonthName(month)}/${year}`;
}

/**
 * Formata referência de mês/ano abreviada (ex: "Dez/2024")
 */
export function formatMonthYearShort(month: number, year: number): string {
  return `${getMonthShortName(month)}/${year}`;
}

/**
 * Calcula percentual de um valor em relação ao total
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Formata percentual com 2 casas decimais
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Verifica se um entry é desconto CLT (INSS ou IRRF)
 */
export function isCLTDiscount(entry: SalaryEntryResponse): boolean {
  return entry.category === "INSS" || entry.category === "IRRF";
}

/**
 * Verifica se um entry é calculado automaticamente
 */
export function isComputedEntry(entry: SalaryEntryResponse): boolean {
  return entry.calculationType === "computed";
}

/**
 * Ordena entries por data de referência (mais recentes primeiro)
 */
export function sortEntriesByDate(entries: SalaryEntryResponse[]): SalaryEntryResponse[] {
  return [...entries].sort((a, b) => {
    if (!a.referenceDate && !b.referenceDate) return 0;
    if (!a.referenceDate) return 1;
    if (!b.referenceDate) return -1;
    return new Date(b.referenceDate).getTime() - new Date(a.referenceDate).getTime();
  });
}

/**
 * Agrupa entries por categoria
 */
export function groupEntriesByCategory(
  entries: SalaryEntryResponse[]
): Record<string, SalaryEntryResponse[]> {
  return entries.reduce((acc, entry) => {
    const category = entry.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(entry);
    return acc;
  }, {} as Record<string, SalaryEntryResponse[]>);
}

/**
 * Calcula total de uma categoria específica
 */
export function calculateCategoryTotal(entries: SalaryEntryResponse[], category: string): number {
  return entries
    .filter((e) => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0);
}
