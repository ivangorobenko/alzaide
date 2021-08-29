import {Result} from "./Result";
import {Event} from "./Event";

export interface QueryHandler<T> {
    handle(Command): Result<Event>;
}
