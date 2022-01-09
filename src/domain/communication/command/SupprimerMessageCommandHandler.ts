import {Command} from "../../../core/Command";
import {CommandHandler} from "../../../core/CommandHandler";
import {CommandResponse} from "../../../core/CommandResponse";
import {Repository} from "../../../core/Repository";
import {Result} from "../../../core/Result";
import {Message} from "../agregat/Message";
import {MessageSupprimeEvent} from "../event/MessageSupprimeEvent";

export const SUPPRIMER_MESSAGE = "SUPPRIMER_MESSAGE";

export class SupprimerMessage extends Command {
    constructor(readonly id: string) {
        super(SUPPRIMER_MESSAGE);
    }
}

export class SupprimerMessageCommandHandler implements CommandHandler {
    private repository: Repository<Message>;

    constructor(repository: Repository<Message>) {
        this.repository = repository;
    }

    handle(command: SupprimerMessage): CommandResponse {
        if (!command.id || command.id === "") return Result.fail("Le message n'a pas pu être laissé");
        this.repository.delete(command.id);
        return Result.ok(new MessageSupprimeEvent(command.id));
    }
}
