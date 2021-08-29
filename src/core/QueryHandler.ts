import {Result} from "./Result";
import {Query} from "./Query";

export interface QueryHandler<T> {
    handle(query: Query): Result<T>;
}
