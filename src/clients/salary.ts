import Client from "./client";
import {
  ActivateSalaryTrackingRequest,
  AddExtraHoursRequest,
  AddOnCallRequest,
  CreateSalaryEntryRequest,
  SalarySummaryResponse,
  SalaryHistoryResponse,
  DashboardSalarySummaryResponse,
} from "@/types/salary";

/**
 * Cliente para API de Salary
 *
 * Gerencia todas as operações relacionadas a detalhamento salarial,
 * incluindo tracking CLT, horas extras, sobreaviso e lançamentos personalizados.
 */
export default class SalaryClient extends Client {
  constructor() {
    super();
  }

  /**
   * Ativa salary tracking em um Income existente
   * @param incomeId ID do Income
   * @param data Configuração do tracking (modo CLT/custom + valor hora)
   */
  public activate(
    incomeId: string,
    data: ActivateSalaryTrackingRequest
  ): Promise<{ message: string }> {
    return this.instance
      .post(`/api/salary/${incomeId}/activate`, data)
      .then(({ data }) => data);
  }

  /**
   * Adiciona horas extras para um mês específico
   * @param incomeId ID do Income
   * @param data Dados das horas extras (mês, ano, horas, valor/hora opcional)
   * @returns Resumo completo do salário do mês
   */
  public addExtraHours(
    incomeId: string,
    data: AddExtraHoursRequest
  ): Promise<SalarySummaryResponse> {
    return this.instance
      .post(`/api/salary/${incomeId}/extra-hours`, data)
      .then(({ data }) => data);
  }

  /**
   * Adiciona horas de sobreaviso para um mês específico
   * @param incomeId ID do Income
   * @param data Dados do sobreaviso (mês, ano, horas)
   * @returns Resumo completo do salário do mês
   */
  public addOnCall(
    incomeId: string,
    data: AddOnCallRequest
  ): Promise<SalarySummaryResponse> {
    return this.instance
      .post(`/api/salary/${incomeId}/on-call`, data)
      .then(({ data }) => data);
  }

  /**
   * Adiciona um entry genérico (desconto personalizado, bônus, etc)
   * @param incomeId ID do Income
   * @param data Dados do entry
   * @returns Entry criado
   */
  public addEntry(
    incomeId: string,
    data: CreateSalaryEntryRequest
  ): Promise<SalarySummaryResponse> {
    return this.instance
      .post(`/api/salary/${incomeId}/entries`, data)
      .then(({ data }) => data);
  }

  /**
   * Remove um entry específico
   * @param entryId ID do entry a remover
   */
  public removeEntry(entryId: string): Promise<{ message: string }> {
    return this.instance
      .delete(`/api/salary/entries/${entryId}`)
      .then(({ data }) => data);
  }

  /**
   * Obtém resumo completo do salário de um mês
   * @param incomeId ID do Income
   * @param month Mês (1-12)
   * @param year Ano
   * @returns Resumo com base, entries, adições, descontos e líquido
   */
  public getSummary(
    incomeId: string,
    month: number,
    year: number
  ): Promise<SalarySummaryResponse> {
    return this.instance
      .get(`/api/salary/${incomeId}/summary/${month}/${year}`)
      .then(({ data }) => data);
  }

  /**
   * Obtém histórico anual de um Income
   * @param incomeId ID do Income
   * @param year Ano
   * @returns Histórico com resumos mensais
   */
  public getHistory(incomeId: string, year: number): Promise<SalaryHistoryResponse> {
    return this.instance
      .get(`/api/salary/${incomeId}/history`, { params: { year } })
      .then(({ data }) => data);
  }

  /**
   * Força recálculo dos entries CLT (INSS/IRRF) de um mês
   * @param incomeId ID do Income
   * @param month Mês (1-12)
   * @param year Ano
   */
  public recalculate(
    incomeId: string,
    month: number,
    year: number
  ): Promise<{ message: string }> {
    return this.instance
      .post(`/api/salary/${incomeId}/recalculate/${month}/${year}`)
      .then(({ data }) => data);
  }

  /**
   * Obtém resumo consolidado de todos os salários para um mês (Dashboard)
   * @param month Mês (1-12)
   * @param year Ano
   * @returns Array com resumos de todos os Incomes com salary tracking
   */
  public getDashboardSummary(
    month: number,
    year: number
  ): Promise<DashboardSalarySummaryResponse> {
    return this.instance
      .get("/api/dashboard/salary-summary", { params: { month, year } })
      .then(({ data }) => data);
  }

  /**
   * Obtém detalhamento de um salário específico (alias do getSummary)
   * @param incomeId ID do Income
   * @param month Mês (1-12)
   * @param year Ano
   * @returns Resumo completo do salário
   */
  public getBreakdown(
    incomeId: string,
    month: number,
    year: number
  ): Promise<SalarySummaryResponse> {
    return this.instance
      .get(`/api/dashboard/salary-breakdown/${incomeId}`, { params: { month, year } })
      .then(({ data }) => data);
  }
}
