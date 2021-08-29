import {Command} from "../../../src/core/Command";
import {Result} from "../../../src/core/Result";
import {QueryBus} from "../../../src/core/QueryBus";
import {Query} from "../../../src/core/Query";

export class TestableQueryBus extends QueryBus {
    get dispatchedQuery(): Query {
        return this._dispatchedQuery;
    }

    private _dispatchedQuery: Command;
    private readonly mockedResult: any;

    constructor(readonly failDispatch: boolean = false, mockedResult={}) {
        super();
        this.mockedResult = mockedResult;
        this._dispatchedQuery = undefined;
    }

    dispatch(query: Query): Result<string> {
        this._dispatchedQuery = query;
        return this.failDispatch ? Result.fail("Echec") : Result.ok(this.mockedResult);
    }
}