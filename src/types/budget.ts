import {z} from "zod"

export const BugdgetFormSchema = z.object({
    id: z.string().uuid().optional(),
    description: z.string(),
    amount: z.coerce.number(),
    endDate: z.date().optional(),
    status: z.string()
});

export type BudgetUsage = {
    description: string,
    amount: number,
    usage: number,
    remaining: number,
}

export type Budget = z.infer<typeof BugdgetFormSchema>;
