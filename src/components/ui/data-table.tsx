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
  PlusCircleIcon,
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "./input"
import { Button } from "./button"
import { Separator } from "./separator"
import { useState } from "react"
import { Badge } from "./badge"
import { TableSkeleton } from "@/lib/table-utils"


type ColumnOption<TData> = {
  id: keyof TData
  name: string
  options?: {
    key: string,
    value: string
  }[]
}

interface DataTableAdvancedFilterProps<TData> {
  options: ColumnOption<TData>[]
  setFilters: (filters: Record<string, string>) => void
  filters: Record<string, string>
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  filtersOptions: DataTableAdvancedFilterProps<TData>,
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  filtersOptions,
  isLoading
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
    }
  })
  const [filterBadges, setFilterBadges] = useState<Record<string, string>>({})

  function DataTableAdvancedFilter<TData>({
    options,
    setFilters,
    filters
  }: DataTableAdvancedFilterProps<TData>) {
    const [selectedColumn, setSelectedColumn] = useState<ColumnOption<TData> | null>(null)
    const [inputValue, setInputValue] = useState("")


    const handleAddFilter = (value: string) => {
      if (!selectedColumn) return

      const updatedFilters = {
        ...filters,
        [selectedColumn.id as string]: value,
      }

      const updatedFiltersBadges = {
        ...filterBadges,
        [selectedColumn.name]: selectedColumn.options ? selectedColumn.options.find(col => col.key == value)?.value || value : value
      }
      console.log(updatedFiltersBadges)

      setFilters(updatedFilters)
      setFilterBadges(updatedFiltersBadges)
      setInputValue("")
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && selectedColumn && inputValue) {
        handleAddFilter(inputValue)
      }
    }

    const handleRemoveFilter = (key: string) => {
      const filterKey = options.find((row) => row.name === key)!.id as string
      const updatedFilters = { ...filters }
      delete updatedFilters[filterKey]
      setFilters(updatedFilters)
      const updatedFiltersBadges = { ...filterBadges }
      delete updatedFiltersBadges[key]
      setFilterBadges(updatedFiltersBadges)
    }

    return (
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex w-full items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-12 w-40 border-dashed rounded-r-none text-left">
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                {selectedColumn ? selectedColumn.name : "Adicionar filtro"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {options.map((option) => (
                <DropdownMenuItem
                  key={String(option.id)}
                  onClick={() => {
                    setSelectedColumn(option)
                    setInputValue("")
                  }}
                >
                  {option.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedColumn?.options ? (
            <Select
              onValueChange={handleAddFilter}
              value={filters[selectedColumn.id as string] || ""}
            >
              <SelectTrigger className="w-[400px] min-h-12 rounded-l-none">
                <SelectValue placeholder={`Selecione ${selectedColumn.name}`} />
              </SelectTrigger>
              <SelectContent>
                {selectedColumn.options.map((opt) => (
                  <SelectItem key={opt.key} value={opt.key}>
                    {opt.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="filter"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={!selectedColumn}
              placeholder="Digite o valor"
              className="h-12 w-[400px] rounded-l-none"
            />
          )}
        </div>

        {Object.entries(filterBadges).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(filterBadges).map(([key, value]) => (
              <Badge
                key={key}
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleRemoveFilter(key)}
              >
                {key}: {value}
              </Badge>
            ))}
          </div>
        )}
      </div>
    )
  }

  const ReportComponent = () => {
    return <>
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
    </>
  }

  const Pagination = () => {
    return <>
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
    </>
  }
  return (
    <>
      <DataTableAdvancedFilter setFilters={filtersOptions.setFilters} options={filtersOptions.options} filters={filtersOptions.filters} />
      <div className="rounded-md border bg-background text-foreground shadow-sm">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <ReportComponent />
            <Separator />
            <Pagination />
          </>)}
      </div >
    </>
  )
}
