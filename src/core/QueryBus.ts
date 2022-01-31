import {Query} from "./Query";
import {QueryHandler} from "./QueryHandler";
import {Result} from "./Result";

export interface QueryHandlers {
    [type: string]: QueryHandler<any>;
}

export class QueryBus {
    constructor(private handlers: QueryHandlers = {}) {}

    subscribe(handler: QueryHandler<any>): void {
        this.handlers[handler.typeOf()] = handler;
    }

    dispatch(query: Query): Result<any> {
        return this.handlers[query.type]?.handle(query);
    }
}
