import { Expense } from "@/types/expense";
import Client from "./client";
import Page from "@/types/page";

export default class ExpenseClient extends Client {
    constructor() {
        super()
    }

    public create(expense: Expense): Promise<void> {
        return this.instance.post("/api/expenses", expense)
    }

    public get(page: number, limit: number, status: string, description: string): Promise<Page<Expense>> {
        return this.instance.get(`/api/expenses?page=${page}&limit=${limit}${status ? `&status=${status}`:""}${description ? `&description=${description}`:""}`).then(({ data }) => data)
    }

    public delete(id: string): Promise<void> {
        return this.instance.delete(`/api/expenses/${id}`)
    }

    public findById(id: string): Promise<Expense> {
        return this.instance.get(`/api/expenses/${id}`).then(({ data }) => data)
    }

    public  update(id: string, body: Expense) {
        return this.instance.put(`/api/expenses/${id}`, body)
    }
}