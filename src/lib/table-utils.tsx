import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { ReactElement } from "react"

type FormatType = "string" | "number" | "date" | "status" | "enum"



function renderStatus(status: string) {
  const base = "capitalize"

  switch (status) {
    case "expired":
      return <Badge variant="destructive" className={base}>Expirado</Badge>
    case "active":
      return <Badge variant="default" className={base}>Ativo</Badge>
    case "pending":
      return <Badge variant="outline" className={base}>Pendente</Badge>
    default:
      return <Badge variant="secondary" className={base}>{status}</Badge>
  }
}

interface EnumValues {
  text: string,
  variant: "default" | "destructive" | "outline" | "secondary",
}
export function createFormattedColumn<T>(
  accessorKey: keyof T,
  header: string,
  formatType: FormatType,
  enumValues?: Record<string, EnumValues>
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const rawValue = row.getValue(accessorKey as string)
      let formattedValue: string | ReactElement = String(rawValue)

      if (formatType === "number") {
        const parsed = parseFloat(String(rawValue))
        formattedValue = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(parsed)
      }

      if (formatType === "date") {
        try {
          formattedValue = rawValue
            ? format(new Date(rawValue as string), "PPP", { locale: ptBR })
            : "-"
        } catch {
          formattedValue = "-"
        }
      }

      if (formatType === "status") {
        formattedValue = renderStatus(rawValue as string)
      }

      if (formatType === "enum" && enumValues) {
        formattedValue = <Badge variant={enumValues[rawValue as string].variant} className={"capitalize"}>{enumValues[rawValue as string].text}</Badge>
      }
      return (

        <div
          className={`truncate overflow-hidden whitespace-nowrap ${formatType === "number" ? "text-right" : "text-left"
            } max-w-[180px]`}
        >
          {formattedValue}
        </div>

      )
    },
  }
}

export function TableSkeleton() {
  return (
    <div className="border rounded-md mt-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center px-4 py-3 border-b space-x-4 animate-pulse">
          <div className="h-4 w-1/4 bg-muted rounded" />
          <div className="h-4 w-1/4 bg-muted rounded" />
          <div className="h-4 w-1/6 bg-muted rounded" />
          <div className="h-4 w-1/6 bg-muted rounded" />
          <div className="h-4 w-1/12 bg-muted rounded" />
        </div>
      ))}
    </div>
  )
}
