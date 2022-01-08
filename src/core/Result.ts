export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    private readonly valueOrError: T;

    public constructor(isSuccess: boolean, valueOrError: T) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.valueOrError = valueOrError;
        Object.freeze(this);
    }

    public getValue(): T {
        return this.valueOrError;
    }

    public static ok<U>(value: U): Result<U> {
        return new Result<U>(true, value);
    }

    public static fail<V>(error: V): Result<V> {
        return new Result<V>(false, error);
    }
}
