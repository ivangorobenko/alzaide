export interface Repository<T> {
    save(value: T): void;
    get(id: string): T;
    getAll(): T[];
}
