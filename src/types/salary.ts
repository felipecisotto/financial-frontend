// ==================== REQUEST TYPES ====================

/**
 * Request para ativar salary tracking em um Income
 */
export interface ActivateSalaryTrackingRequest {
  discountMode: "CLT" | "custom";
  hourlyRate: number;
}

/**
 * Request para criar um entry genérico de salary
 */
export interface CreateSalaryEntryRequest {
  month: number;
  year: number;
  entryType: "discount" | "addition";
  category: string;
  calculationType: "fixed" | "percentage" | "computed";
  baseValue: number;
  multiplier: number;
  description?: string;
  referenceDate?: string;
}

/**
 * Request para adicionar horas extras
 */
export interface AddExtraHoursRequest {
  month: number;
  year: number;
  hours: number;
  rate?: number;
  referenceDate?: string;
}

/**
 * Request para adicionar sobreaviso
 */
export interface AddOnCallRequest {
  month: number;
  year: number;
  hours: number;
  referenceDate?: string;
}

/**
 * Parâmetros para consultar histórico salarial
 */
export interface SalaryHistoryParams {
  year: number;
}

/**
 * Parâmetros para consultar resumo salarial mensal
 */
export interface SalarySummaryParams {
  month: number;
  year: number;
}

// ==================== RESPONSE TYPES ====================

/**
 * Entry individual de salary (desconto ou adição)
 */
export interface SalaryEntryResponse {
  id: string;
  incomeId: string;
  month: number;
  year: number;
  entryType: "discount" | "addition";
  category: string;
  calculationType: "fixed" | "percentage" | "computed";
  baseValue: number;
  multiplier: number;
  amount: number;
  description?: string;
  referenceDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Resumo completo do salário de um mês
 */
export interface SalarySummaryResponse {
  incomeId: string;
  description: string;
  month: number;
  year: number;
  baseAmount: number;
  entries: SalaryEntryResponse[];
  totalAdditions: number;
  totalDiscounts: number;
  netAmount: number;
}

/**
 * Resumo mensal simplificado para histórico
 */
export interface MonthlySummary {
  month: number;
  baseAmount: number;
  totalAdditions: number;
  totalDiscounts: number;
  netAmount: number;
}

/**
 * Histórico anual completo de um Income
 */
export interface SalaryHistoryResponse {
  incomeId: string;
  description: string;
  year: number;
  monthlySummaries: MonthlySummary[];
}

/**
 * Resumo consolidado de todos os salários para o Dashboard
 */
export interface DashboardSalarySummaryResponse {
  month: number;
  year: number;
  salaries: SalarySummaryResponse[];
}

// ==================== CONSTANTS ====================

/**
 * Categorias disponíveis para entries
 */
export const ENTRY_CATEGORIES = {
  // Discounts
  INSS: "INSS",
  IRRF: "IRRF",
  HEALTH_INSURANCE: "health_insurance",
  UNION_FEE: "union_fee",
  MEAL_VOUCHER: "meal_voucher",
  TRANSPORT_VOUCHER: "transport_voucher",
  LOAN: "loan",

  // Additions
  EXTRA_HOURS: "extra_hours",
  ON_CALL: "on_call",
  BONUS: "bonus",
  COMMISSION: "commission",
  OTHER: "other",
} as const;

/**
 * Labels em português para as categorias
 */
export const ENTRY_CATEGORY_LABELS: Record<string, string> = {
  INSS: "INSS",
  IRRF: "IRRF",
  health_insurance: "Plano de Saúde",
  union_fee: "Sindicato",
  meal_voucher: "Vale Alimentação",
  transport_voucher: "Vale Transporte",
  loan: "Empréstimo",
  extra_hours: "Hora Extra",
  on_call: "Sobreaviso",
  bonus: "Bônus",
  commission: "Comissão",
  other: "Outros",
};

export type EntryCategory = typeof ENTRY_CATEGORIES[keyof typeof ENTRY_CATEGORIES];
export type EntryType = "discount" | "addition";
export type CalculationType = "fixed" | "percentage" | "computed";
export type DiscountMode = "CLT" | "custom";

// ==================== UTILITY TYPES ====================

/**
 * Entries agrupados por tipo (adições e descontos)
 */
export interface SalaryEntryGrouped {
  additions: SalaryEntryResponse[];
  discounts: SalaryEntryResponse[];
}

/**
 * Cálculo detalhado do salário
 */
export interface SalaryCalculation {
  gross: number;
  additions: number;
  discounts: number;
  net: number;
}
