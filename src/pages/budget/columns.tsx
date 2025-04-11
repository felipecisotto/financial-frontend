import ReportAction from "@/components/ui/report-action"
import { Budget } from "@/types/budget"
import { ColumnDef } from "@tanstack/react-table"
import { createFormattedColumn } from "@/lib/table-utils" // ou onde você salvar

interface Props {
    editAction: (budget: Budget) => void
    deleteAction: (budget: Budget) => Promise<void>
}

export function columns({ editAction, deleteAction }: Props): ColumnDef<Budget>[] {
    return [
        createFormattedColumn<Budget>("description", "Descrição", "string"),
        createFormattedColumn<Budget>("endDate", "Expira em", "date"),
        createFormattedColumn<Budget>("status", "Status", "status"),
        {
            ...createFormattedColumn<Budget>("amount", "Valor", "number"),
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
