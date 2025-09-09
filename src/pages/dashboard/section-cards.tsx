import { Card, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ReactElement, useEffect, useState, useMemo } from 'react';
import MonthSummary from '@/types/MonthSummary.ts';
import { dashboardClient } from '@/lib/api-clients';
import { toast } from 'sonner';

function Content({ data }: { data: MonthSummary }) {
    // Memoize formatter to avoid creating new instance on each render
    const currencyFormatter = useMemo(() => new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }), []);

    // Memoize formatted values
    const formattedData = useMemo(() => ({
        totalIncome: currencyFormatter.format(data.totalIncome),
        totalExpense: currencyFormatter.format(data.totalExpense),
        totalRemaining: currencyFormatter.format(data.totalRemaining)
    }), [data.totalIncome, data.totalExpense, data.totalRemaining, currencyFormatter]);

    return (
        <div
            className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-3 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            <Card className="@container/card pb-8">
                <CardHeader className="relative">
                    <CardDescription>Receita do mês</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {formattedData.totalIncome}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Despesas do mês</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {formattedData.totalExpense}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Disponivel</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {formattedData.totalRemaining}
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}

function CardSkeleton(): ReactElement {
    return (
        <div className="@xl/main:grid-cols-3 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
        </div>
    )
}

export function SectionCards(): ReactElement {
    const [isCardsLoading, setIsCardsLoading] = useState(true);
    const [summary, setSummary] = useState<MonthSummary>({} as MonthSummary);

    useEffect(() => {
        const date = new Date()
        dashboardClient.getMonthSummary(date.getMonth(), date.getFullYear()).then((data) => {
            setSummary(data)
            setIsCardsLoading(false)
        }).catch(() => {
            toast.error("Erro ao buscar resumo do mês")
        })
    }, [])

    {
        return <>
            {isCardsLoading ? <CardSkeleton /> : <Content data={summary} />}
        </>
    }
}
