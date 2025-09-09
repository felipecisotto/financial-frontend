"use client"

import { memo } from "react";
import { budgetClient } from "@/lib/api-clients"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Title from "@/components/ui/title"
import { BugdgetFormSchema } from "@/types/budget"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

function BudgetForm() {
    const form = useForm<z.infer<typeof BugdgetFormSchema>>({
        resolver: zodResolver(BugdgetFormSchema),
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
            } finally {
                setIsLoading(false)
            }
        }

        fetchBudget()
    }, [id, form])

    const onSubmit = useCallback(async (values: z.infer<typeof BugdgetFormSchema>) => {
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
    }, [id, isEdit, navigate]);



    return (

        <div className="max-w-xl mx-auto mt-10 px-4">
            <Title value={isEdit ? "Editar Orçamento" : "Criar Orçamento"} />
            {isLoading ? (
                <div className="space-y-6 mt-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex justify-end">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isEdit}
                                            placeholder="Ex: Conta de luz"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            placeholder="R$ 0,00"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Data de Vencimento</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "pl-3 text-left font-normal w-full",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: ptBR })
                                                    ) : (
                                                        <span>Escolha uma data</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                                locale={ptBR}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="w-32 transition-all duration-300 hover:scale-105"
                            >
                                {isEdit ? "Salvar" : "Criar"}
                            </Button>

                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default memo(BudgetForm);
