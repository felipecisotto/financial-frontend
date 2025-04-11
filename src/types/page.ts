export default interface Page<T> {
    page: number
    limit: number
    totalPages: number
    results: T[]
}