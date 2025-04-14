import ReportAction from "@/components/ui/report-action"
import { ColumnDef } from "@tanstack/react-table"
import { createFormattedColumn } from "@/lib/table-utils" // ou onde você salvar
import { Income } from "@/types/income"

interface Props {
    editAction: (incoming: Income) => void
    deleteAction: (incoming: Income) => Promise<void>
}

export function columns({ editAction, deleteAction }: Props): ColumnDef<Income>[] {
    return [
        createFormattedColumn<Income>("description", "Descrição", "string"),
        createFormattedColumn<Income>("dueDay", "Recebimento no dia", "string"),
        createFormattedColumn<Income>("startDate", "Inicio", "date"),
        createFormattedColumn<Income>("endDate", "Fim", "date"),
        createFormattedColumn<Income>("type", "Tipo", "enum", {
            fixed: {
                text: "Fixo",
                variant: "default"
            },
            variable: {
                text: "Variável",
                variant: "secondary"
            }
        }),
        {
            ...createFormattedColumn<Income>("amount", "Valor", "number"),
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
