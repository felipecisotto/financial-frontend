import BudgetClient from '@/clients/budget'
import ExpenseClient from '@/clients/expense'
import IncomeClient from '@/clients/income'
import DashboardClient from '@/clients/Dashboard'
import SalaryClient from '@/clients/salary'

// Criar instâncias singleton
export const budgetClient = new BudgetClient()
export const expenseClient = new ExpenseClient()
export const incomeClient = new IncomeClient()
export const dashboardClient = new DashboardClient()
export const salaryClient = new SalaryClient()

// Exportar tipos para TypeScript
export type { BudgetClient, ExpenseClient, IncomeClient, DashboardClient, SalaryClient }