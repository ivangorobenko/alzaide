import {MessageDB} from "../../../tst/application/mapper/MessageDataMapper.spec";
import {Message} from "../../domain/agregat/Message";
import {MessageDataMapper} from "../mapper/MessageDataMapper";
import {MessageRepository} from "./MessageRepository";

interface MessagesDB {
    [name: string]: MessageDB;
}

export class MessageRepositoryImpl implements MessageRepository {
    private readonly data: MessagesDB;

    constructor() {
        this.data = {};
    }

    findAllMessages(): Message[] {
        const messages: Message[] = Object.values(this.data).map(messageDB =>
            MessageDataMapper.mapFromDBToDomain(messageDB)
        );
        return messages;
    }

    async save(id: string, value: Message): Promise<void> {
        const messageDB = MessageDataMapper.mapFromDomainToDB(value);
        this.data[id] = messageDB;
    }

    async delete(id: string): Promise<void> {
        delete this.data[id];
    }
}
