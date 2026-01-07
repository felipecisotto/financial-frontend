import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Title from "@/components/ui/title";
import { salaryClient, incomeClient } from "@/lib/api-clients";
import { SalarySummaryResponse } from "@/types/salary";
import { Income } from "@/types/income";
import { formatCurrency, groupEntriesByType, getCategoryLabel, formatMonthYear } from "@/lib/salary";
import { ArrowLeft, Plus, TrendingDown, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SalaryDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [income, setIncome] = useState<Income | null>(null);
    const [summary, setSummary] = useState<SalarySummaryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Current month/year
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [incomeData, summaryData] = await Promise.all([
                    incomeClient.findById(id),
                    salaryClient.getSummary(id, selectedMonth, selectedYear)
                ]);

                setIncome(incomeData);
                setSummary(summaryData);
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
                toast.error("Erro ao carregar detalhamento salarial");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, selectedMonth, selectedYear]);

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto">
                <Skeleton className="h-10 w-64 mb-6" />
                <div className="grid gap-4 md:grid-cols-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        );
    }

    if (!income || !summary) {
        return (
            <div className="max-w-6xl mx-auto">
                <Title value="Erro" />
                <p>Não foi possível carregar os dados do salário.</p>
            </div>
        );
    }

    const grouped = groupEntriesByType(summary.entries);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/incomes")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <Title value={`Detalhamento Salarial - ${income.description}`} />
                        <p className="text-sm text-muted-foreground">
                            {formatMonthYear(selectedMonth, selectedYear)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                        <DollarSign className="h-3 w-3" />
                        {income.discountMode === "CLT" ? "CLT" : "Personalizado"}
                    </Badge>
                    {income.hourlyRate && (
                        <Badge variant="secondary">
                            R$ {income.hourlyRate.toFixed(2)}/h
                        </Badge>
                    )}
                </div>
            </div>

            {/* Month/Year Selector */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Período
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (selectedMonth === 1) {
                                    setSelectedMonth(12);
                                    setSelectedYear(selectedYear - 1);
                                } else {
                                    setSelectedMonth(selectedMonth - 1);
                                }
                            }}
                        >
                            ← Anterior
                        </Button>
                        <span className="font-medium min-w-[150px] text-center">
                            {formatMonthYear(selectedMonth, selectedYear)}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (selectedMonth === 12) {
                                    setSelectedMonth(1);
                                    setSelectedYear(selectedYear + 1);
                                } else {
                                    setSelectedMonth(selectedMonth + 1);
                                }
                            }}
                        >
                            Próximo →
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Salário Base</CardDescription>
                        <CardTitle className="text-2xl">
                            {formatCurrency(summary.baseAmount)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Adições
                        </CardDescription>
                        <CardTitle className="text-2xl text-green-600">
                            {formatCurrency(summary.totalAdditions)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            Descontos
                        </CardDescription>
                        <CardTitle className="text-2xl text-red-600">
                            {formatCurrency(summary.totalDiscounts)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border-primary">
                    <CardHeader className="pb-3">
                        <CardDescription>Salário Líquido</CardDescription>
                        <CardTitle className="text-2xl text-primary">
                            {formatCurrency(summary.netAmount)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Entries Details */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Additions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                Adições
                            </span>
                            <Button size="sm" variant="outline" className="gap-1">
                                <Plus className="h-3 w-3" />
                                Adicionar
                            </Button>
                        </CardTitle>
                        <CardDescription>
                            Horas extras, bônus, comissões
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {grouped.additions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Nenhuma adição neste mês
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {grouped.additions.map((entry) => (
                                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium text-sm">
                                                {getCategoryLabel(entry.category)}
                                            </p>
                                            {entry.description && (
                                                <p className="text-xs text-muted-foreground">
                                                    {entry.description}
                                                </p>
                                            )}
                                            {entry.referenceDate && (
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(entry.referenceDate).toLocaleDateString('pt-BR')}
                                                </p>
                                            )}
                                        </div>
                                        <span className="font-semibold text-green-600">
                                            +{formatCurrency(entry.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Discounts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <TrendingDown className="h-5 w-5 text-red-600" />
                                Descontos
                            </span>
                            <Button size="sm" variant="outline" className="gap-1">
                                <Plus className="h-3 w-3" />
                                Adicionar
                            </Button>
                        </CardTitle>
                        <CardDescription>
                            INSS, IRRF, plano de saúde, etc
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {grouped.discounts.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Nenhum desconto neste mês
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {grouped.discounts.map((entry) => (
                                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium text-sm">
                                                {getCategoryLabel(entry.category)}
                                            </p>
                                            {entry.description && (
                                                <p className="text-xs text-muted-foreground">
                                                    {entry.description}
                                                </p>
                                            )}
                                            {entry.calculationType === "computed" && (
                                                <Badge variant="outline" className="text-xs mt-1">
                                                    Calculado automaticamente
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="font-semibold text-red-600">
                                            -{formatCurrency(entry.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Calculation Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Cálculo do Salário</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Salário Base</span>
                            <span className="font-medium">{formatCurrency(summary.baseAmount)}</span>
                        </div>
                        <div className="flex justify-between py-2 text-green-600">
                            <span>(+) Total de Adições</span>
                            <span className="font-medium">{formatCurrency(summary.totalAdditions)}</span>
                        </div>
                        <div className="flex justify-between py-2 text-red-600">
                            <span>(-) Total de Descontos</span>
                            <span className="font-medium">{formatCurrency(summary.totalDiscounts)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between py-2 text-lg">
                            <span className="font-semibold">(=) Salário Líquido</span>
                            <span className="font-bold text-primary">{formatCurrency(summary.netAmount)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
