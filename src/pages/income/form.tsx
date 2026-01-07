import { memo } from "react";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Title from "@/components/ui/title"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { incomeClient } from "@/lib/api-clients"
import { IncomeFormSchema } from "@/types/income"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function IncomeForm() {
    const form = useForm<z.infer<typeof IncomeFormSchema>>({
        resolver: zodResolver(IncomeFormSchema),
        defaultValues: {
            description: "",
            amount: 0,
            startDate: new Date(),
            hasSalaryTracking: false
        }
    })

    const [enableSalaryTracking, setEnableSalaryTracking] = useState(false)

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
                    startDate: income.startDate,
                    endDate: income.endDate,
                    discountMode: income.discountMode,
                    hourlyRate: income.hourlyRate,
                    hasSalaryTracking: income.hasSalaryTracking
                })
                setEnableSalaryTracking(income.hasSalaryTracking || false)
            } catch (err) {
                console.error("Erro ao buscar orçamento:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBudget()
    }, [id, form])

    const onSubmit = useCallback(async (values: z.infer<typeof IncomeFormSchema>) => {
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
    }, [id, isEdit, navigate]);



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

                        {/* Salary Tracking Section */}
                        <Card className="border-dashed">
                            <CardHeader>
                                <CardTitle className="text-lg">Detalhamento Salarial</CardTitle>
                                <CardDescription>
                                    Ative para rastrear horas extras, sobreaviso e descontos (INSS, IRRF, etc)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="hasSalaryTracking"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Ativar rastreamento salarial
                                                </FormLabel>
                                                <FormDescription>
                                                    Permite adicionar movimentações mensais como horas extras e descontos
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={(checked: boolean) => {
                                                        field.onChange(checked)
                                                        setEnableSalaryTracking(checked)
                                                        if (!checked) {
                                                            form.setValue("discountMode", undefined)
                                                            form.setValue("hourlyRate", undefined)
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {enableSalaryTracking && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="discountMode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Modo de Desconto</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Selecione o modo de desconto" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="CLT">CLT (INSS + IRRF automático)</SelectItem>
                                                            <SelectItem value="custom">Personalizado</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        CLT calcula automaticamente INSS e IRRF segundo legislação brasileira
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="hourlyRate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Valor/Hora (R$)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            step={0.01}
                                                            placeholder="Ex: 30.00"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Usado para calcular horas extras e sobreaviso
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>

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

export default memo(IncomeForm);
