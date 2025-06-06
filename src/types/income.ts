import { z } from "zod"

export const IncomeFormSchema = z.object({
    id: z.string().uuid().optional(),
    description: z.string(),
    amount: z.coerce.number(),
    type: z.string(),
    dueDay: z.coerce.number().optional(),
    endDate: z.date().optional(),
    startDate: z.date()
});


export type Income = z.infer<typeof IncomeFormSchema>;