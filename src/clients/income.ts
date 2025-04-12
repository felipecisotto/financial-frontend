import Client from "./client";
import Page from "@/types/page";
import { Income } from "@/types/income";

export default class IncomeClient extends Client {
    constructor() {
        super()
    }

    public create(budget: Income): Promise<void> {
        return this.instance.post("/api/incomes", budget)
    }

    public get(page: number, limit: number, status: string, description: string): Promise<Page<Income>> {
        return this.instance.get(`/api/incomes?page=${page}&limit=${limit}${status ? `&status=${status}` : ""}${description ? `&description=${description}` : ""}`).then(({ data }) => data)
    }

    public delete(id: string): Promise<void> {
        return this.instance.delete(`/api/incomes/${id}`)
    }

    public findById(id: string): Promise<Income> {
        return this.instance.get(`/api/incomes/${id}`).then(({ data }) => data)
    }

    update(id: string, body: Income) {
        return this.instance.put(`/api/incomes/${id}`, body)
    }
}