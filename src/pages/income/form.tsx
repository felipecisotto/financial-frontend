"use client"

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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import IncomeClient from "@/clients/income"
import { IncomeFormSchema } from "@/types/income"
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function IncomeForm() {
    const incomeClient = new IncomeClient()
    const form = useForm<z.infer<typeof IncomeFormSchema>>({
        resolver: zodResolver(IncomeFormSchema),
        defaultValues: {
            description: "",
            amount: 0,
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
                const income = await incomeClient.findById(id)
                form.reset({
                    description: income.description,
                    amount: income.amount,
                    dueDay: income.dueDay,
                    type: income.type,
                })
            } catch (err) {
                console.error("Erro ao buscar orçamento:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBudget()
    }, [id, form])

    async function onSubmit(values: z.infer<typeof IncomeFormSchema>) {
        try {
            if (isEdit) {
                await incomeClient.update(id!, values)
                toast.success("Receita atualizada com sucesso!")
            } else {
                await incomeClient.create(values)
                toast.success("Receita criada com sucesso!")
            }
            navigate("/incomes")
        } catch (err) {
            toast.error("Erro ao salvar a receita. Verifique os dados.")
            console.error(err)
        }
    }



    return (

        <div className="max-w-xl mx-auto mt-10 px-4">
            <Title value={isEdit ? "Editar Receita" : "Criar Receita"} />
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
                                            placeholder="Ex: Salário"
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
                            name="dueDay"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dia do Vencimento</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            max={31}
                                            step={1}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>

                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={"Selecione o tipo de receita"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="fixed">Fixo</SelectItem>
                                            <SelectItem value="variable">Variável</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        {/* <FormField
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
                                </FormItem> */}



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
