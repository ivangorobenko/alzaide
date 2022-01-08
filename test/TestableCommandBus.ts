import {Command} from "../src/core/Command";
import {CommandBus} from "../src/core/CommandBus";
import {CommandResponse} from "../src/core/CommandResponse";
import {Event} from "../src/core/Event";
import {Result} from "../src/core/Result";

class DummyEvent extends Event {
    constructor() {
        super("id");
    }
}

export class TestableCommandBus<T extends Command> extends CommandBus {
    get dispatchedCommand(): T | undefined {
        return this._dispatchedCommand;
    }

    private _dispatchedCommand: T | undefined;

    constructor(readonly failDispatch: boolean = false) {
        super();
    }

    dispatch(command: T): CommandResponse {
        this._dispatchedCommand = command;
        return this.failDispatch ? Result.fail("Echec") : Result.ok(new DummyEvent());
    }
}
