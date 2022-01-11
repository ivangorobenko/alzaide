import {Command} from "./Command";
import {CommandResponse} from "./CommandResponse";

export interface CommandHandler {
    handle(command: Command): CommandResponse;
    typeOf(): string;
}
