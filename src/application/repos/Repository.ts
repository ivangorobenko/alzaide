export interface Repository<T> {
    save(id: string, value: T): void;
}