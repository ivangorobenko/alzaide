export interface Repository<T> {
    save(id: string, value: T): void;
    get(id: string): T;
    delete(id: string): void;
    getAll(): T[];
}
