import {Command} from "../../core/Command";
import {MessageRepository} from "../../application/repos/MessageRepository";
import {Result} from "../../core/Result";
import {MessageSupprimeEvent} from "../event/MessageSupprimeEvent";

export const SUPPRIMER_MESSAGE = "SUPPRIMER_MESSAGE";

export class SupprimerMessage extends Command {
    constructor(readonly id: string) {
        super(SUPPRIMER_MESSAGE);
    }
}

export class SupprimerMessageCommandHandler {
    private repository: MessageRepository;

    constructor(repository: MessageRepository) {
        this.repository = repository;
    }

    handle(command: SupprimerMessage): Result<any> {
        if (!command.id || command.id === "") return Result.fail("Le message n'a pas pu être laissé");
        this.repository.delete(command.id);
        return Result.ok(new MessageSupprimeEvent(command.id));
    }
}