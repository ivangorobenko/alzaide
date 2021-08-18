import {Result} from "../../core/Result";
import {Message} from "../agregat/Message";
import {Timer} from "../../core/Timer";
import {Repository} from "../../repos/Repository";
import {MessageLaisseEvent} from "../event/MessageLaisseEvent";
import {Command} from "../../core/Command";

export const LAISSER_MESSAGE =
    "LAISSER_MESSAGE";

export class LaisserMessageCommandHandler {
    private command: LaisserMessage;
    private repository: Repository;
    private timer: Timer;

    constructor(command: LaisserMessage, repository: Repository, timer: Timer) {
        this.command = command;
        this.repository = repository;
        this.timer = timer;
    }

    handle(): Result<MessageLaisseEvent> {
        const messageOrError: Result<Message> = Message.create(this.command.contenu, this.timer.now());
        if (messageOrError.isFailure) return Result.fail("Le message n'a pas pu être laissé")
        const message: Message = messageOrError.getValue();
        this.repository.save(message.id, message)
        return Result.ok(new MessageLaisseEvent(message.id));
    }
}


export class LaisserMessage extends Command{
    constructor(readonly contenu:string) {
        super(LAISSER_MESSAGE);
    }
}