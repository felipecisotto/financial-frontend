import { z } from 'zod';
import { BudgetFormSchema } from './budget';


export const ExpenseFormSchema = z.object({
    id: z.string().optional(),
    description: z.string(),
    amount: z.coerce.number(),
    type: z.string(),
    budgetId: z.string().optional(),
    recurrency: z.string().optional(),
    method: z.string(),
    installments: z.coerce.number().optional(),
    dueDay: z.coerce.number(),
    startDate: z.date(),
    endDate: z.date().optional(),
    budget: BudgetFormSchema.optional(),
});

export type Expense = z.infer<typeof ExpenseFormSchema>;