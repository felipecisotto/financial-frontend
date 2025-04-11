"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "./input"
import { Button } from "./button"
import { Separator } from "./separator"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "./badge"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  onFilterChange: (filters: Record<string, string>) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  onFilterChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    onPaginationChange,
    state: {
      pagination,
    },
  })

  const FilterInput = () => {

    // 🧠 Filtro genérico
    const filterableColumns = useMemo(() => {
      return columns.filter(
        (col): col is ColumnDef<TData, TValue> & { accessorKey: string } =>
          typeof col === "object" &&
          "accessorKey" in col &&
          typeof col.accessorKey === "string"
      )
    }, [columns])

    const [selectedColumn, setSelectedColumn] = useState<string | null>(null)
    const [inputValue, setInputValue] = useState("")

    const handleInputChange = (value: string) => {
      setInputValue(value)
    }

    // 🧼 limpa input se trocar o campo
    useEffect(() => {
      setInputValue("")
    }, [selectedColumn])

    return <>
      {filterableColumns.length > 0 && (
        <div className="flex flex-wrap items-end p-4 border-b border-muted/40">
          <div className="flex flex-col space-y-1">
            <label htmlFor="field" className="text-xs text-muted-foreground">
              Filtrar
            </label>
            <Select
              onValueChange={(value) => setSelectedColumn(value)}
              value={selectedColumn ?? ""}
            >
              <SelectTrigger className="w-[180px] h-8 rounded-r-none">
                <SelectValue placeholder="Selecionar campo" />
              </SelectTrigger>
              <SelectContent>
                {filterableColumns.map((col) => (
                  <SelectItem key={col.accessorKey} value={col.accessorKey}>
                    {col.header?.toString() ?? col.accessorKey}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <Input
              id="filter"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && selectedColumn) {
                  onFilterChange({ [selectedColumn]: inputValue })
                  console.log('ok')
                }
              }}
              disabled={!selectedColumn}
              placeholder="Digite o valor"
              className="h-9 w-[300px] rounded-l-none"
            />
          </div>

          {selectedColumn && inputValue && (
            <p className="text-xs text-muted-foreground ml-2 mt-1 align-middle h-8">
              <Badge className="" variant={"outline"}>{inputValue}</Badge>
            </p>
          )}
        </div>
      )}
    </>
  }

  return (
    <div className="rounded-md border bg-background text-foreground shadow-sm">
      {/* 🔍 Área de filtros */}
      <FilterInput />
      {/* Tabela */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-muted/40">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="uppercase text-muted-foreground tracking-wider text-xs px-3 py-2"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-b border-muted/30 hover:bg-muted/10 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id} className="bg-muted text-muted-foreground font-medium">
              {footerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      </Table>

      <Separator />

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-4 text-sm">
        {/* Linhas por página */}
        <div className="flex items-center space-x-2">
          <p className="text-muted-foreground">Linhas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Página atual */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-muted-foreground">
            Página{" "}
            <strong>{table.getState().pagination.pageIndex + 1}</strong> de{" "}
            <strong>{table.getPageCount()}</strong>
          </span>
        </div>

        {/* Navegação */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
