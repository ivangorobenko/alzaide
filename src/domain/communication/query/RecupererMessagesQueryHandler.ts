import {Query} from "../../../core/Query";
import {QueryHandler} from "../../../core/QueryHandler";
import {Result} from "../../../core/Result";
import {Message} from "../agregat/Message";
import {MessageRepository} from "../repository/MessageRepository";

export const RECUPERER_MESSAGES = "RECUPERER_MESSAGES";

export class RecupererMessagesQueryHandler implements QueryHandler<Message[]> {
    private messageRepository: MessageRepository;

    constructor(repository: MessageRepository) {
        this.messageRepository = repository;
    }

    handle(query: RecupererMessagesQuery): Result<Message[]> {
        return Result.ok(
            this.messageRepository.getAll().sort((message1, message2) => message2.timestamp - message1.timestamp)
        );
    }

    typeOf(): string {
        return RECUPERER_MESSAGES;
    }
}

export class RecupererMessagesQuery extends Query {
    constructor() {
        super(RECUPERER_MESSAGES);
    }
}
