export interface Repository<T> {
    save(id: string, value: T): void;

    delete(id: string): void;
}
