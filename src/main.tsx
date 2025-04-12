import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/dashboard/index.tsx'
import { ThemeProvider } from './components/theme-provider'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Budgets from './pages/budget/index.tsx'
import { BudgetForm } from './pages/budget/form.tsx'
import { Toaster } from 'sonner'
import Incomings from './pages/income/index.tsx'
import { IncomeForm } from './pages/income/form.tsx'


const Layout = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className='m-8'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href='/'>Ínicio</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href='/'>Despesas</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href='/incomes'>Receitas</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href='/budgets'>Budgets</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className='mt-4'>
          <Outlet />
        </div>
      </div>
    </ThemeProvider >
  )
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/budgets",
        element: <Budgets />
      },

      {
        path: "/budget", // Para editar um existente
        element: <BudgetForm />
      },
      {
        path: "/budget/:id", // Para editar um existente
        element: <BudgetForm />
      },
      {
        path: "/incomes",
        element: <Incomings />
      },
      {
        path: "/income/:id",
        element:<IncomeForm/>
      },
      {
        path: "/income",
        element:<IncomeForm/>
      }
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster richColors position="top-right" />
  </StrictMode>,
)
