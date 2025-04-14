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

    public async get(page: number, limit: number, type?: string, description?: string): Promise<Page<Income>> {
        const params: { [key: string]: number | string } = { page, limit };

        if (type) {
            params.type = type;
        }
        if (description) {
            params.description = description;
        }

        try {
            const { data } = await this.instance.get("/api/incomes", { params });
            return data;
        } catch (error) {
            console.error("Erro ao buscar incomes:", error);
            throw error;
        }
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