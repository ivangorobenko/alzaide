import {MessageDataMapper} from "../../application/mapper/MessageDataMapper";
import {MessageDB} from "../../application/repos/MessageDB";
import {MessageRepository} from "../../application/repos/MessageRepository";
import {Message} from "../../domain/agregat/Message";

interface MessagesDB {
    [name: string]: MessageDB;
}

export class InMemoryMessageRepositoryImpl implements MessageRepository {
    private readonly data: MessagesDB;

    constructor() {
        this.data = {};
    }

    findAllMessages(): Message[] {
        return Object.values(this.data).map(messageDB => MessageDataMapper.mapFromDBToDomain(messageDB));
    }

    async save(id: string, value: Message): Promise<void> {
        this.data[id] = MessageDataMapper.mapFromDomainToDB(value);
    }

    async delete(id: string): Promise<void> {
        if (this.data[id]) delete this.data[id];
    }
}
