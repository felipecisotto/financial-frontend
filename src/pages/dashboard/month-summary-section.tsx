import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Skeleton } from '@/components/ui/skeleton.tsx';
import {useState, useMemo, useEffect} from "react"
import {dashboardClient} from '@/lib/api-clients.ts';
import MonthlyEvolution from '@/types/MonthlyEvolution.ts';

type contentProps = {
    chartData: MonthlyEvolution[];
}

function Content({chartData}: contentProps): React.ReactElement {

    const chartConfig = useMemo(() => ({
        expense: {
            label: "Despesas",
            color: "hsl(0, 84%, 60%)",
        },
        income: {
            label: "Receitas",
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig), []);
    return <div
        className="*:data-[slot=card]:shadow-xs px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
        <Card>
            <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
                <CardDescription>Janeiro - Dezembro {(new Date()).getFullYear()}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="h-72 w-full" config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                        width={undefined}
                        height={undefined}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={0}
                            tickFormatter={(value) => {
                                const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                                return months[value - 1] || "";
                            }}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="expense"
                            type="monotone"
                            stroke="var(--color-expense)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="income"
                            type="monotone"
                            stroke="var(--color-income)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
}

function SummarySkeleton(): React.ReactElement {
    return (
        <Skeleton className="mx-6 h-72 w-full" />
    )
}

export function MonthSummarySection() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState<MonthlyEvolution[]>([]);
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        dashboardClient.getMonthlyEvolution(currentYear)
            .then((data) => {
                setData(data)
                setLoading(false)
            })

    }, []);
    return (
        <>
            {isLoading ? <SummarySkeleton /> : (<Content chartData={data} />)}
        </>
    )
}
