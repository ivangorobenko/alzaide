import {CommandBus} from "../../../src/core/CommandBus";
import {Command} from "../../../src/core/Command";
import {Result} from "../../../src/core/Result";

export class TestableCommandBus extends CommandBus {
    get dispatchedCommand(): Command {
        return this._dispatchedCommand;
    }

    private _dispatchedCommand: Command;

    constructor(readonly failDispatch: boolean = false) {
        super();
        this._dispatchedCommand = undefined;
    }

    dispatch(command: Command): Result<string> {
        this._dispatchedCommand = command;
        return this.failDispatch ? Result.fail("Faileure") : Result.ok();
    }
}