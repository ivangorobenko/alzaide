import {v4 as uuidv4} from "uuid";
import {MessageRepository} from "../../application/repos/MessageRepository";
import {Command} from "../../core/Command";
import {Result} from "../../core/Result";
import {Timer} from "../../core/Timer";
import {Message} from "../agregat/Message";
import {MessageLaisseEvent} from "../event/MessageLaisseEvent";

export const LAISSER_MESSAGE = "LAISSER_MESSAGE";

export class LaisserMessageCommandHandler {
    private repository: MessageRepository;
    private timer: Timer;

    constructor(repository: MessageRepository, timer: Timer) {
        this.repository = repository;
        this.timer = timer;
    }

    handle(command: LaisserMessage): Result<MessageLaisseEvent> {
        console.log({command: command.contenu});
        const messageOrError: Result<Message> = Message.create(uuidv4(), command.contenu.message, this.timer.now());
        if (messageOrError.isFailure) return Result.fail("Le message n'a pas pu être laissé");
        const message: Message = messageOrError.getValue();
        this.repository.save(message.id, message);
        return Result.ok(new MessageLaisseEvent(message.id));
    }
}

export class LaisserMessage extends Command {
    constructor(readonly contenu: any) {
        super(LAISSER_MESSAGE);
    }
}
