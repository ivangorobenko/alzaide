import {Result} from "./Result";
import {Event} from "./Event";

export interface CommandHandler<T> {
    handle(Command): Result<Event>;
}
