import { useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { budgetClient } from "@/lib/api-clients"
import { BudgetFormSchema } from "@/types/budget"

export function useBudgetForm() {
    const form = useForm<z.infer<typeof BudgetFormSchema>>({
        resolver: zodResolver(BudgetFormSchema),
        defaultValues: {
            description: "",
            amount: 0,
            status: "active"
        }
    })

    const { id } = useParams()
    const isEdit = Boolean(id)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!id) return

        const fetchBudget = async () => {
            setIsLoading(true)
            try {
                const budget = await budgetClient.findById(id)
                form.reset({
                    description: budget.description,
                    amount: budget.amount,
                    endDate: budget.endDate,
                })
            } catch (err) {
                console.error("Erro ao buscar orçamento:", err)
                toast.error("Erro ao carregar orçamento")
            } finally {
                setIsLoading(false)
            }
        }

        fetchBudget()
    }, [id, form])

    const onSubmit = useCallback(async (values: z.infer<typeof BudgetFormSchema>) => {
        try {
            if (isEdit) {
                await budgetClient.update(id!, values)
                toast.success("Orçamento atualizado com sucesso!")
            } else {
                await budgetClient.create(values)
                toast.success("Orçamento criado com sucesso!")
            }
            navigate("/budgets")
        } catch (err) {
            toast.error("Erro ao salvar o orçamento. Verifique os dados.")
            console.error(err)
        }
    }, [id, isEdit, navigate])

    return {
        form,
        isEdit,
        isLoading,
        onSubmit
    }
}