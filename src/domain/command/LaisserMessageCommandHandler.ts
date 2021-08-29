import {Result} from "../../core/Result";
import {Message} from "../agregat/Message";
import {Timer} from "../../core/Timer";
import {Repository} from "../../application/repos/Repository";
import {MessageLaisseEvent} from "../event/MessageLaisseEvent";
import {Command} from "../../core/Command";
import {v4 as uuidv4} from "uuid";
import {MessageRepository} from "../../application/repos/MessageRepository";

export const LAISSER_MESSAGE =
    "LAISSER_MESSAGE";

export class LaisserMessageCommandHandler {
    private repository: MessageRepository;
    private timer: Timer;

    constructor(repository: MessageRepository, timer: Timer) {
        this.repository = repository;
        this.timer = timer;
    }

    handle(command: LaisserMessage): Result<MessageLaisseEvent> {
        const messageOrError: Result<Message> = Message.create(uuidv4(),
            command.contenu, this.timer.now());
        if (messageOrError.isFailure) return Result.fail("Le message n'a pas pu être laissé")
        const message: Message = messageOrError.getValue();
        this.repository.save(message.id, message)
        return Result.ok(new MessageLaisseEvent(message.id));
    }
}


export class LaisserMessage extends Command {
    constructor(readonly contenu: string) {
        super(LAISSER_MESSAGE);
    }
}