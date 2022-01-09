import {Query} from "../../../core/Query";
import {QueryHandler} from "../../../core/QueryHandler";
import {Repository} from "../../../core/Repository";
import {Result} from "../../../core/Result";
import {Message} from "../agregat/Message";

export const RECUPERER_MESSAGES = "RECUPERER_MESSAGES";

export class RecupererMessagesQueryHandler implements QueryHandler<Message[]> {
    private messageRepository: Repository<Message>;

    constructor(repository: Repository<Message>) {
        this.messageRepository = repository;
    }

    handle(query: RecupererMessagesQuery): Result<Message[]> {
        return Result.ok(
            this.messageRepository.getAll().sort((message1, message2) => message2.timestamp - message1.timestamp)
        );
    }
}

export class RecupererMessagesQuery extends Query {
    constructor() {
        super(RECUPERER_MESSAGES);
    }
}
