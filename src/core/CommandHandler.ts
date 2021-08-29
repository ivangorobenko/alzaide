import {Result} from "./Result";
import {Event} from "./Event";
import {Command} from "./Command";

export interface CommandHandler<T> {
    handle(command: Command): Result<Event>;
}
