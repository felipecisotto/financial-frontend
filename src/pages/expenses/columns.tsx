import ReportAction from "@/components/ui/report-action"
import { ColumnDef } from "@tanstack/react-table"
import { createFormattedColumn } from "@/lib/table-utils"
import { Expense } from "@/types/expense"

interface Props {
    editAction: (expense: Expense) => void
    deleteAction: (expense: Expense) => Promise<void>
}

export function columns({ editAction, deleteAction }: Props): ColumnDef<Expense>[] {
    return [
        createFormattedColumn<Expense>("description", "Descrição", "string"),
        createFormattedColumn<Expense>("dueDay", "Dia do Pagamento", "string"),
        createFormattedColumn<Expense>("installments", "Parcelas", "string"),
        createFormattedColumn<Expense>("startDate", "Inicio", "date"),
        createFormattedColumn<Expense>("endDate", "Fim", "date"),
        createFormattedColumn<Expense>("type", "Tipo", "enum", {
            recurring: {
                text: "Recorrente",
                variant: "default"
            },
            single: {
                text: "Único",
                variant: "secondary"
            }
        }),
        createFormattedColumn<Expense>("method", "Método de pagamento", "enum", {
            credit_card: {
                text: "Cartão de Crédito",
                variant: "default"
            },
            pix: {
                text: "PIX",
                variant: "secondary"
            },
            bank_slip: {
                text: "Boleto",
                variant: "outline"
            }
        }),
        createFormattedColumn<Expense>("recurrency", "Recorrencia", "enum", {
            monthly: {
                text: "Mensal",
                variant: "default"
            },
            weekly: {
                text: "Semanal",
                variant: "secondary"
            },
            daily: {
                text: "Diário",
                variant: "outline"
            }
        }),
        {
            ...createFormattedColumn<Expense>("amount", "Valor", "number"),
            footer: ({ table }) => {
                const total = table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => {
                        const value = parseFloat(row.getValue("amount"))
                        return sum + (isNaN(value) ? 0 : value)
                    }, 0)

                const formattedValue = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(total)

                return <div
                    className={`truncate overflow-hidden whitespace-nowrap text-right max-w-[180px]`}>
                    {formattedValue}
                </div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <ReportAction
                    deleteAction={() => deleteAction(row.original)}
                    editAction={() => editAction(row.original)}
                />
            ),
        },
    ]
}
