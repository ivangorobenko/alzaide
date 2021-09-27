import {MessageRepository} from "../../application/repos/MessageRepository";
import {Query} from "../../core/Query";
import {QueryHandler} from "../../core/QueryHandler";
import {Result} from "../../core/Result";
import {Message} from "../agregat/Message";

export const RECUPERER_MESSAGES = "RECUPERER_MESSAGES";

export class MessagesQueryHandler implements QueryHandler<Message[]> {
    private messageRepository: MessageRepository;

    constructor(repository: MessageRepository) {
        this.messageRepository = repository;
    }

    handle(query: MessagesQuery): Result<Message[]> {
        const messages = this.messageRepository.findAllMessages();
        return Result.ok(messages);
    }
}

export class MessagesQuery extends Query {
    constructor() {
        super(RECUPERER_MESSAGES);
    }
}
