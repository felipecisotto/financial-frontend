import { Budget } from "@/types/budget";
import Client from "./client";
import Page from "@/types/page";

export default class BudgetClient extends Client {
    constructor() {
        super()
    }

    public create(budget: Budget): Promise<void> {
        return this.instance.post("/api/budgets", budget)
    }

    public get(page: number, limit: number, status: string, description: string): Promise<Page<Budget>> {
        return this.instance.get(`/api/budgets?page=${page}&limit=${limit}${status ? `&status=${status}`:""}${description ? `&description=${description}`:""}`).then(({ data }) => data)
    }

    public delete(id: string): Promise<void> {
        return this.instance.delete(`/api/budgets/${id}`)
    }

    public findById(id: string): Promise<Budget> {
        return this.instance.get(`/api/budgets/${id}`).then(({ data }) => data)
    }

    update(id: string, body: Budget) {
        return this.instance.put(`/api/budgets/${id}`, body)
    }
}