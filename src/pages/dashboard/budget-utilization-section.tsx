"use client"

import {Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, XAxis, YAxis} from "recharts"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {ReactElement, useEffect, useState} from 'react';
import {toast} from 'sonner';
import {BudgetUsage} from '@/types/budget.ts';
import DashboardClient from '@/clients/Dashboard.ts';
import {Skeleton} from '@/components/ui/skeleton.tsx';

const processChartData = (data: BudgetUsage[]) => {
    if (data.length <= 4) {
        return data.map((item, index) => ({
            ...item,
            fill: `var(--chart-${index + 1})`
        }));
    }
    
    const topFour = data.slice(0, 4).map((item, index) => ({
        ...item,
        fill: `var(--chart-${index + 1})`
    }));
    
    const others = data.slice(4).reduce(
        (acc, curr) => ({
            description: "Outros",
            amount: acc.amount + curr.amount,
            usage: acc.usage + curr.usage,
            remaining: acc.remaining + curr.remaining,
        }),
        {description: "Outros", amount: 0, usage: 0, remaining: 0}
    );
    
    return [...topFour, {...others, fill: 'var(--chart-5)'}];
};


type props = {
    budgetUtilization: BudgetUsage[]
}

function Content({budgetUtilization}: props) {
    
    const dynamicConfig: ChartConfig = {
        remaining: {
            label: "Utilização",
            color: "var(--primary)"
        },
        description: {
            label: "Descrição",
            color: "var(--chart-1)"
        }
    };
    
    return (
        <div
            className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-1 @5xl/main:grid-cols-2 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            <Card>
                <CardHeader>
                    <CardTitle>Utilização dos Orçamentos</CardTitle>
                    <CardDescription>Top 5 mais utilizados</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer className="max-h-92 w-full" config={dynamicConfig}>
                        <BarChart
                            accessibilityLayer
                            data={budgetUtilization}
                            layout="vertical"
                            margin={{
                                right: 16,
                            }}
                        >
                            <CartesianGrid horizontal={false}/>
                            <YAxis
                                dataKey="description"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                                hide
                            />
                            <XAxis dataKey="remaining" type="number" hide/>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line"/>}
                            />
                            <Bar
                                dataKey="remaining"
                                layout="vertical"
                                radius={4}
                            >
                                {budgetUtilization?.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.remaining >= 80 ? '#ef4444' : '#22c55e'}
                                    />
                                ))}
                                
                                <LabelList
                                    dataKey="description"
                                    position="insideLeft"
                                    offset={8}
                                    fontSize={12}
                                    fill="#FFF"
                                />
                                {/*<LabelList*/}
                                {/*    dataKey="remaining"*/}
                                {/*    position="right"*/}
                                {/*    offset={8}*/}
                                {/*    className="fill-foreground"*/}
                                {/*    fontSize={12}*/}
                                {/*/>*/}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Utilização dos orçamentos</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={dynamicConfig}
                        className="mx-auto aspect-square max-h-80"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel/>}
                            />
                            <Pie data={processChartData(budgetUtilization)} dataKey="remaining" nameKey="description"/>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
function CardSkeleton(): ReactElement {
    return (
        <div className="@xl/main:grid-cols-1 @5xl/main:grid-cols-2 grid grid-cols-1 gap-4 px-4">
            <Skeleton className="h-92"/>
            <Skeleton className="h-92"/>
        </div>
    )
}
export function BudgetUtilizationSection() {
    const [budgetUtilization, setBudgetUtilization] = useState([] as BudgetUsage[]);
    const [isBudgetUtilizationLoading, setIsBudgetUtilizationLoading] = useState(true);
    const dashboard = new DashboardClient()
    useEffect(() => {
        const date = new Date()
        dashboard.getBudgetUsage(date.getMonth(), date.getFullYear())
            .then((data) => {
                // console.log(data)
                setBudgetUtilization(data)
                setIsBudgetUtilizationLoading(false)
            }).catch(() => {
            toast.error("Erro ao buscar resumo do mês")
        });
    }, [])
    return (
        <>
            {isBudgetUtilizationLoading ? <CardSkeleton/> : (<Content budgetUtilization={budgetUtilization}/>)}
        </>
    )
}
