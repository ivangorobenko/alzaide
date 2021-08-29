import {Query} from "./Query";
import {QueryHandler} from "./QueryHandler";
import {Result} from "./Result";

export interface QueryHandlers {
    [type: string]: QueryHandler<Query>;
}

export class QueryBus {
    constructor(private handlers: QueryHandlers = {}) {}

    subscribe(type: string, handler: QueryHandler<Query>): void {
        this.handlers[type] = handler;
    }

    dispatch(query: Query): Result<any> {
        return this.handlers[query.type]?.handle(query);
    }
}
