import {MessageDataMapper} from "../../application/mapper/MessageDataMapper";
import {Message} from "../../domain/communication/agregat/Message";
import {MessageRepository} from "../../domain/communication/repository/MessageRepository";
import {InMemoryRepository} from "./InMemoryRepository";
import {MessageDB} from "./MessageDB";

export class InMemoryMessageRepository extends InMemoryRepository<MessageDB> implements MessageRepository {
    async save(id: string, value: Message): Promise<void> {
        this.data[id] = MessageDataMapper.mapFromDomainToDB(value);
    }

    getAll(): Message[] {
        return Object.values(this.data)
            .map(messageDB => MessageDataMapper.mapFromDBToDomain(messageDB))
            .filter(message => message !== undefined) as Message[];
    }

    get(id: string): Message {
        return MessageDataMapper.mapFromDBToDomain(this.data[id]) as Message;
    }

    delete(key: string): void {
        if (this.data[key]) delete this.data[key];
    }
}
