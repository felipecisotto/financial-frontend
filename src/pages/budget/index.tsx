import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Title from "@/components/ui/title";
import { Link, useNavigate } from "react-router-dom";
import BudgetClient from "@/clients/budget";
import { useEffect, useState } from "react";
import { Budget } from "@/types/budget";
import Page from "@/types/page";
import { PaginationState } from "@tanstack/react-table";

export default function Budgets() {
    const budgetClient = new BudgetClient();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [data, setData] = useState({
        limit: pagination.pageSize,
        page: pagination.pageIndex,
        totalPages: 1,
        results: []
    } as Page<Budget>);

    const [filters, setFilters] = useState({} as Record<string, string>)

    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate();

    function getData() {
        setIsLoading(true)
        budgetClient.get(pagination.pageIndex + 1, pagination.pageSize, filters['status'], filters['description']).then((budgetsPage) => {
            setData(budgetsPage)
            setIsLoading(false)
        }).catch((err) => {
            console.error("Erro ao buscar dados:", err)
            setIsLoading(false)
        })
    }


    const editAction = (budget: Budget) => {
        navigate(`/budget/${budget.id}`)
    }

    const deleteAction = async (budget: Budget) => {
        await budgetClient.delete(budget.id!);
        getData()
    }

    useEffect(() => {
        getData();
    }, [pagination, filters])

    return (
        <>
            <Title primaryAction={<Link to={"/budget"}>Criar</Link>} value="Budgets" />
            <DataTable columns={columns({ editAction, deleteAction })}
                data={data.results}
                pageCount={data.totalPages + 1}
                onPaginationChange={setPagination}
                pagination={pagination}
                filtersOptions={
                    {
                        options:
                            [
                                { id: "status", name: "Status", options: [{ key: "active", value: "Ativo" }, { key: "expired", value: "Expirado" }] },
                                { id: "description", name: "Descrição" }
                            ],
                        setFilters,
                        filters
                    }
                }
                isLoading={isLoading}
            />
        </>
    )
}

