import {MessageRepository} from "./MessageRepository";
import {Message} from "../../domain/agregat/Message";
import {MessageDB} from "../../../tst/application/mapper/MessageDataMapper.spec";
import {MessageDataMapper} from "../mapper/MessageDataMapper";

interface MessagesDB {
    [name: string]: MessageDB
}

export class InMemoryMessageRepositoryImpl implements MessageRepository {
    private readonly data: MessagesDB;

    constructor() {
        this.data = {}
    }

    findAllMessages(): Message[] {
        const messages: Message[] = Object.values(this.data).map((messageDB) => MessageDataMapper.mapFromDBToDomain(messageDB))
        return messages;
    }

    async save(id: string, value: Message): Promise<void> {
        const messageDB = MessageDataMapper.mapFromDomainToDB(value);
        this.data[id] = messageDB;
    }
}