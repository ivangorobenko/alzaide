import {CommandHandler} from "./CommandHandler";

export interface CommandHandlers {
    [type: string]: CommandHandler<any>;
}