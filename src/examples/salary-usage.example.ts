/**
 * Exemplos de uso do SalaryClient
 *
 * Este arquivo serve como documentação de como usar a API de Salary.
 * Não deve ser importado em código de produção.
 */

import SalaryClient from "@/clients/salary";
import {
  groupEntriesByType,
  formatCurrency,
  calculateSalary,
  getCategoryLabel,
  formatMonthYear,
} from "@/lib/salary";

// ==================== SETUP INICIAL ====================

async function setupSalaryTracking() {
  const salaryClient = new SalaryClient();

  // 1. Criar Income com salary tracking já ativado
  // Isso seria feito no IncomeClient, mas o tipo já suporta os campos
  // const newIncome = {
  //   description: "Salário Empresa X",
  //   amount: 5000,
  //   type: "fixed",
  //   dueDay: 5,
  //   startDate: "2024-12-01T00:00:00Z",
  //   discountMode: "CLT" as const,
  //   hourlyRate: 30,
  // };
  // await incomeClient.create(newIncome);

  // 2. Ou ativar tracking em um Income existente
  await salaryClient.activate("income-123", {
    discountMode: "CLT",
    hourlyRate: 30,
  });
}

// ==================== ADICIONAR MOVIMENTAÇÕES ====================

async function addMonthlyEntries() {
  const salaryClient = new SalaryClient();
  const incomeId = "income-123";
  const month = 12;
  const year = 2024;

  // 1. Adicionar horas extras
  const summaryAfterExtras = await salaryClient.addExtraHours(incomeId, {
    month,
    year,
    hours: 8,
    rate: 45, // Opcional, usa hourlyRate do income se omitido
    referenceDate: "2024-12-10",
  });

  console.log(`Líquido após extras: ${formatCurrency(summaryAfterExtras.netAmount)}`);

  // 2. Adicionar sobreaviso
  const summaryAfterOnCall = await salaryClient.addOnCall(incomeId, {
    month,
    year,
    hours: 24,
    referenceDate: "2024-12-15",
  });

  console.log(`Líquido após sobreaviso: ${formatCurrency(summaryAfterOnCall.netAmount)}`);

  // 3. Adicionar desconto personalizado (plano de saúde)
  await salaryClient.addEntry(incomeId, {
    month,
    year,
    entryType: "discount",
    category: "health_insurance",
    calculationType: "fixed",
    baseValue: 200,
    multiplier: 1,
    description: "Unimed Premium",
  });

  // 4. Adicionar bônus
  await salaryClient.addEntry(incomeId, {
    month,
    year,
    entryType: "addition",
    category: "bonus",
    calculationType: "fixed",
    baseValue: 500,
    multiplier: 1,
    description: "Bônus de desempenho",
  });
}

// ==================== CONSULTAR RESUMOS ====================

async function getSalaryDetails() {
  const salaryClient = new SalaryClient();
  const incomeId = "income-123";
  const month = 12;
  const year = 2024;

  // 1. Obter resumo do mês
  const summary = await salaryClient.getSummary(incomeId, month, year);

  console.log(`\n=== ${summary.description} - ${formatMonthYear(month, year)} ===`);
  console.log(`Salário Base: ${formatCurrency(summary.baseAmount)}`);
  console.log(`Total Adições: ${formatCurrency(summary.totalAdditions)}`);
  console.log(`Total Descontos: ${formatCurrency(summary.totalDiscounts)}`);
  console.log(`Salário Líquido: ${formatCurrency(summary.netAmount)}`);

  // 2. Agrupar entries por tipo
  const grouped = groupEntriesByType(summary.entries);

  console.log("\n--- Adições ---");
  grouped.additions.forEach((entry) => {
    console.log(
      `${getCategoryLabel(entry.category)}: ${formatCurrency(entry.amount)}`
    );
  });

  console.log("\n--- Descontos ---");
  grouped.discounts.forEach((entry) => {
    console.log(
      `${getCategoryLabel(entry.category)}: ${formatCurrency(entry.amount)}`
    );
  });

  // 3. Calcular valores detalhados
  const calc = calculateSalary(summary);
  console.log("\n--- Cálculo Detalhado ---");
  console.log(`Bruto: ${formatCurrency(calc.gross)}`);
  console.log(`(-) Descontos: ${formatCurrency(calc.discounts)}`);
  console.log(`(=) Líquido: ${formatCurrency(calc.net)}`);
}

// ==================== HISTÓRICO ANUAL ====================

async function getYearHistory() {
  const salaryClient = new SalaryClient();
  const incomeId = "income-123";
  const year = 2024;

  const history = await salaryClient.getHistory(incomeId, year);

  console.log(`\n=== Histórico ${year} - ${history.description} ===`);
  history.monthlySummaries.forEach((monthly) => {
    console.log(
      `${monthly.month.toString().padStart(2, "0")}/2024: ` +
        `Líquido ${formatCurrency(monthly.netAmount)} ` +
        `(Base: ${formatCurrency(monthly.baseAmount)}, ` +
        `Adições: ${formatCurrency(monthly.totalAdditions)}, ` +
        `Descontos: ${formatCurrency(monthly.totalDiscounts)})`
    );
  });
}

// ==================== DASHBOARD ====================

async function getDashboardData() {
  const salaryClient = new SalaryClient();
  const month = 12;
  const year = 2024;

  // 1. Resumo consolidado de todos os salários
  const dashboard = await salaryClient.getDashboardSummary(month, year);

  console.log(`\n=== Dashboard - ${formatMonthYear(month, year)} ===`);

  let totalNet = 0;
  dashboard.salaries.forEach((salary) => {
    console.log(
      `\n${salary.description}: ${formatCurrency(salary.netAmount)}`
    );
    console.log(`  Base: ${formatCurrency(salary.baseAmount)}`);
    console.log(`  Adições: ${formatCurrency(salary.totalAdditions)}`);
    console.log(`  Descontos: ${formatCurrency(salary.totalDiscounts)}`);
    totalNet += salary.netAmount;
  });

  console.log(`\nTotal Líquido Geral: ${formatCurrency(totalNet)}`);

  // 2. Detalhamento de um salário específico
  if (dashboard.salaries.length > 0) {
    const firstIncomeId = dashboard.salaries[0].incomeId;
    const breakdown = await salaryClient.getBreakdown(firstIncomeId, month, year);

    console.log(`\n--- Detalhamento ${breakdown.description} ---`);
    breakdown.entries.forEach((entry) => {
      const signal = entry.entryType === "addition" ? "+" : "-";
      console.log(
        `${signal} ${getCategoryLabel(entry.category)}: ${formatCurrency(entry.amount)}`
      );
    });
  }
}

// ==================== RECÁLCULO CLT ====================

async function recalculateCLT() {
  const salaryClient = new SalaryClient();
  const incomeId = "income-123";
  const month = 12;
  const year = 2024;

  // Útil quando o salário base muda e você quer recalcular INSS/IRRF
  await salaryClient.recalculate(incomeId, month, year);

  console.log("Descontos CLT recalculados com sucesso");

  // Obter novo resumo
  const summary = await salaryClient.getSummary(incomeId, month, year);
  console.log(`Novo líquido: ${formatCurrency(summary.netAmount)}`);
}

// ==================== REMOVER ENTRY ====================

async function removeEntry() {
  const salaryClient = new SalaryClient();
  const entryId = "entry-456";

  await salaryClient.removeEntry(entryId);
  console.log("Entry removido com sucesso");
}

// Exportar para evitar warnings de unused
export {
  setupSalaryTracking,
  addMonthlyEntries,
  getSalaryDetails,
  getYearHistory,
  getDashboardData,
  recalculateCLT,
  removeEntry,
};
