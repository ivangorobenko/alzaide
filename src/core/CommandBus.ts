import {Command} from "./Command";
import {CommandHandler} from "./CommandHandler";
import {CommandHandlers} from "./CommandHandlers";
import {Event} from "./Event";
import {Result} from "./Result";

export class CommandBus {
    private readonly handlers: CommandHandlers;

    constructor() {
        this.handlers = {};
    }

    subscribe(type: string, handler: CommandHandler): void {
        this.handlers[type] = handler;
    }

    dispatch(command: Command): Result<Event | string> {
        return this.handlers[command.type]?.handle(command);
    }
}
