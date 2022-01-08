import {MessageDataMapper} from "../../application/mapper/MessageDataMapper";
import {MessageRepository} from "../../application/repos/MessageRepository";
import {Message} from "../../domain/communication/agregat/Message";
import {MessageDB} from "./MessageDB";

interface MessagesDB {
    [name: string]: MessageDB;
}

export class InMemoryMessageRepositoryImpl implements MessageRepository {
    private readonly data: MessagesDB;

    constructor() {
        this.data = {};
    }

    findAllMessages(): Message[] {
        return Object.values(this.data)
            .map(messageDB => MessageDataMapper.mapFromDBToDomain(messageDB))
            .filter(message => message !== undefined) as Message[];
    }

    async save(id: string, value: Message): Promise<void> {
        this.data[id] = MessageDataMapper.mapFromDomainToDB(value);
    }

    async delete(id: string): Promise<void> {
        if (this.data[id]) delete this.data[id];
    }
}
