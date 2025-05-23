import Client from '@/clients/client.ts';
import MonthSummary from '@/types/MonthSummary.ts';
import {BudgetUsage} from '@/types/budget.ts';

export default class DashboardClient extends Client {
    constructor() {
        super();
    }
    
    public getMonthSummary(month: number, year: number): Promise<MonthSummary> {
        return this.instance.get(`/api/dashboard/summary?month=${month}&year=${year}`).then(({data}) => data)
    }
    
    public getBudgetUsage(month: number, year: number): Promise<BudgetUsage[]> {
        return this.instance.get(`/api/dashboard/budget/utilization?month=${month}&year=${year}`).then(({data}) =>
            data.map((budget: BudgetUsage) => ({
                ...budget,
                
                remaining: (budget.usage / budget.amount) * 100,
            }))
                .filter((budget: BudgetUsage) => budget.remaining > 0)
                .sort((a, b) => b.remaining - a.remaining))
    }
}
