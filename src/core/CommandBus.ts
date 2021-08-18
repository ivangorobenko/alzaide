import {Command} from "./Command";
import {CommandHandlers} from "./CommandHandlers";
import {CommandHandler} from "./CommandHandler";
import {Result} from "./Result";


export class CommandBus {
    private readonly handlers: CommandHandlers;

    constructor() {
        this.handlers = {}
    }

    subscribe(type: string, handler: CommandHandler<any>): void {
        this.handlers[type] = handler;
    }

    dispatch(command: Command): Result<string> {
        const resultOrError = this.handlers[command.type]?.handle(command);
        if (resultOrError.isFailure) return Result.fail(resultOrError.error)
        return Result.ok(resultOrError.getValue().id)
    }
}