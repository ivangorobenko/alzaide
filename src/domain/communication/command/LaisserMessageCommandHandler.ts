import {Command} from "../../../core/Command";
import {CommandHandler} from "../../../core/CommandHandler";
import {CommandResponse} from "../../../core/CommandResponse";
import {Repository} from "../../../core/Repository";
import {Result} from "../../../core/Result";
import {Timer} from "../../../core/Timer";
import {Message} from "../agregat/Message";
import {MessageLaisseEvent} from "../event/MessageLaisseEvent";
import {IdGenerator} from "../repository/IdGenerator";

export const LAISSER_MESSAGE = "LAISSER_MESSAGE";

export class LaisserMessageCommandHandler implements CommandHandler {
    private repository: Repository<Message>;
    private timer: Timer;
    private idGenerator: IdGenerator;

    constructor(repository: Repository<Message>, timer: Timer, idGenerator: IdGenerator) {
        this.repository = repository;
        this.timer = timer;
        this.idGenerator = idGenerator;
    }

    handle(command: LaisserMessage): CommandResponse {
        const messageOrError = Message.create(this.idGenerator.generate(), command.message, this.timer.now());
        if (messageOrError.isFailure) return Result.fail("Le message n'a pas pu être laisser");
        const message = messageOrError.getValue() as Message;
        this.repository.save(message);
        return Result.ok(new MessageLaisseEvent(message.id));
    }
}

export class LaisserMessage extends Command {
    constructor(readonly message: string) {
        super(LAISSER_MESSAGE);
    }
}
