import { DataTable } from "@/components/ui/data-table";
import Title from "@/components/ui/title";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Page from "@/types/page";
import { PaginationState } from "@tanstack/react-table";
import IncomeClient from "@/clients/income";
import { Income } from "@/types/income";
import { columns } from "./columns";

export default function Incomings() {
    const incomeClient = new IncomeClient();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [data, setData] = useState({
        limit: pagination.pageSize,
        page: pagination.pageIndex,
        totalPages: 1,
        results: []
    } as Page<Income>);

    const [filters, setFilters] = useState({} as Record<string, string>)

    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate();

    function getData() {
        setIsLoading(true)
        incomeClient.get(pagination.pageIndex + 1, pagination.pageSize, filters['status'], filters['description']).then((page) => {
            setData(page)
            setIsLoading(false)
        }).catch((err) => {
            console.error("Erro ao buscar dados:", err)
            setIsLoading(false)
        })
    }


    const editAction = (income: Income) => {
        navigate(`/income/${income.id}`)
    }

    const deleteAction = async (income: Income) => {
        await incomeClient.delete(income.id!);
        getData()
    }

    useEffect(() => {
        getData();
    }, [pagination, filters])

    return (
        <>
            <Title primaryAction={<Link to={"/income"}>Criar</Link>} value="Receitas" />
            <DataTable columns={columns({ editAction, deleteAction })}
                data={data.results}
                pageCount={data.totalPages + 1}
                onPaginationChange={setPagination}
                pagination={pagination}
                filtersOptions={
                    {
                        options:
                            [
                                // { id: "status", name: "Status", options: [{ key: "active", value: "Ativo" }, { key: "expired", value: "Expirado" }] },
                                { id: "description", name: "Descrição" },
                                {
                                    id: "type", name: "Tipo", options: [
                                        { key: "fixed", value: "Fixo" },
                                        { key: "variable", value: "Variável" },

                                    ]
                                }
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

