import {Query} from "./Query";
import {Result} from "./Result";

export interface QueryHandler<T> {
    handle(query: Query): Result<T>;

    typeOf(): string;
}
