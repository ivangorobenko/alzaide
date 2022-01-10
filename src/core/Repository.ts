export interface Repository<T> {
    save(value: T): void;
    getAll(): T[];
}
