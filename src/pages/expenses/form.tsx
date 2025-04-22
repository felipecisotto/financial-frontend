"use client"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import { Input } from "@/components/ui/input"
import Title from "@/components/ui/title"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import ExpenseClient from "@/clients/expense"
import { ExpenseFormSchema } from "@/types/expense"
import BudgetClient from "@/clients/budget"
import { Budget } from "@/types/budget"

export function ExpenseForm() {
    const expenseClient = new ExpenseClient()
    const budgetClient = new BudgetClient();
    const [budgets, setBudgets] = useState([] as Budget[])

    const form = useForm<z.infer<typeof ExpenseFormSchema>>({
        resolver: zodResolver(ExpenseFormSchema),
        defaultValues: {
            description: "",
            amount: 0,
            startDate: new Date(),
            dueDay: new Date().getDate()
        }
    })

    const { id } = useParams()
    const isEdit = Boolean(id)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!id) return

        const fetchExpense = async () => {
            setIsLoading(true)
            try {
                const income = await expenseClient.findById(id)
                form.reset({
                    ...income
                })
            } catch (err) {
                console.error("Erro ao buscar orçamento:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchExpense()
    }, [id, form])

    useEffect(() => {
        budgetClient.get(1, 1000, "active", "").then((budgetsPage) => setBudgets(budgetsPage.results))
    },[])

    async function onSubmit(values: z.infer<typeof ExpenseFormSchema>) {
        try {
            if (isEdit) {
                await expenseClient.update(id!, values)
                toast.success("Receita atualizada com sucesso!")
            } else {
                await expenseClient.create(values)
                toast.success("Receita criada com sucesso!")
            }
            navigate("/expenses")
        } catch (err) {
            toast.error("Erro ao salvar a receita. Verifique os dados.")
            console.error(err)
        }
    }

    const watchType = form.watch("type")


    useEffect(() => {
        if (watchType === "recurring") {
            form.register("recurrency");
        } else {
            form.unregister("recurrency");
        }
    }, [watchType, form]);


    const watchMetod = form.watch("method")


    useEffect(() => {
        if (watchMetod === "credit_card") {
            form.register("installments");
            form.setValue("installments", 1)
        } else {
            form.unregister("installments");
        }
    }, [watchMetod, form]);

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
                                            placeholder="Ex: iFood"
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
                                                <SelectValue placeholder={"Selecione o tipo de despesa"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="recurring">Recorrente</SelectItem>
                                            <SelectItem value="single">Único</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        {watchType === "recurring" ?
                            <FormField
                                control={form.control}
                                name="recurrency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recorrencia</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>

                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={"Selecione o tipo de receita"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="monthly">Mensal</SelectItem>
                                                <SelectItem value="weekly">Semanal</SelectItem>
                                                <SelectItem value="daily">Diario</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} /> : ""}
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Método de Pagamento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>

                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={"Selecione o método de pagamento"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pix">Pix</SelectItem>
                                            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                                            <SelectItem value="bank_slip">Boleto bancário</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        {watchMetod == "credit_card" ?
                            <FormField
                                control={form.control}
                                name="installments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parcelas</FormLabel>
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
                            : null}

                        <FormField
                            control={form.control}
                            name="budgetId"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Orçamento</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-[200px] justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? budgets.find(
                                                                (budget) => budget.id === field.value
                                                            )?.description
                                                            : "Selecione o Budget"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Procure o orçamento..." />
                                                    <CommandList>
                                                        <CommandEmpty>Orçamentos não encontrados</CommandEmpty>
                                                        <CommandGroup>
                                                            {budgets.map((budget) => (
                                                                <CommandItem
                                                                    value={budget.description}
                                                                    key={budget.id}
                                                                    onSelect={() => {
                                                                        form.setValue("budgetId", budget.id)
                                                                    }}
                                                                >
                                                                    {budget.description}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            budget.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }} />

                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Inicio</FormLabel>
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
                            )} />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fim</FormLabel>
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
                            )} />



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
