import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Wallet,
  Plus,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  // Keyboard shortcut listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Handle navigation and close dialog
  const handleNavigate = (path: string) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Digite para buscar..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => handleNavigate("/")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Ínicio</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/expenses")}>
            <Receipt className="mr-2 h-4 w-4" />
            <span>Despesas</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/incomes")}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Receitas</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/budgets")}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>Budgets</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Ações Rápidas">
          <CommandItem onSelect={() => handleNavigate("/budget")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Criar Budget</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/expense")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Criar Despesa</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/income")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Criar Receita</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
