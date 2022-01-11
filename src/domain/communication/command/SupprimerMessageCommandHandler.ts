import {Command} from "../../../core/Command";
import {CommandHandler} from "../../../core/CommandHandler";
import {CommandResponse} from "../../../core/CommandResponse";
import {Result} from "../../../core/Result";
import {MessageSupprimeEvent} from "../event/MessageSupprimeEvent";
import {MessageRepository} from "../repository/MessageRepository";

export const SUPPRIMER_MESSAGE = "SUPPRIMER_MESSAGE";

export class SupprimerMessage extends Command {
    constructor(readonly id: string) {
        super(SUPPRIMER_MESSAGE);
    }
}

export class SupprimerMessageCommandHandler implements CommandHandler {
    private repository: MessageRepository;

    constructor(repository: MessageRepository) {
        this.repository = repository;
    }

    handle(command: SupprimerMessage): CommandResponse {
        if (!command.id || command.id === "") return Result.fail("Le message n'a pas pu être laissé");
        this.repository.delete(command.id);
        return Result.ok(new MessageSupprimeEvent(command.id));
    }

    typeOf(): string {
        return SUPPRIMER_MESSAGE;
    }
}
