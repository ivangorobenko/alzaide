import {Query} from "../src/core/Query";
import {QueryBus} from "../src/core/QueryBus";
import {Result} from "../src/core/Result";

export class TestableQueryBus<T extends Query> extends QueryBus {
    get dispatchedQuery(): T | undefined {
        return this._dispatchedQuery;
    }

    private _dispatchedQuery: T | undefined;
    private readonly mockedResult: any;

    constructor(readonly failDispatch: boolean = false, mockedResult = {}) {
        super();
        this.mockedResult = mockedResult;
        this._dispatchedQuery = undefined;
    }

    dispatch(query: T): Result<any> {
        this._dispatchedQuery = query;
        return this.failDispatch ? Result.fail(this.mockedResult) : Result.ok(this.mockedResult);
    }
}
