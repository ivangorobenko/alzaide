import {MessageDataMapper} from "../../../application/mapper/MessageDataMapper";
import {Message} from "../../../domain/communication/agregat/Message";
import {MessageRepository} from "../../../domain/communication/repository/MessageRepository";
import {MessageDB} from "../collection/MessageDB";
import {InMemoryRepository} from "./InMemoryRepository";

export class InMemoryMessageRepository extends InMemoryRepository<MessageDB> implements MessageRepository {
    save(value: Message): void {
        this.data[this.idGenerator.generate()] = MessageDataMapper.mapFromDomainToDB(value);
    }

    getAll(): Message[] {
        return Object.values(this.data)
            .map(messageDB => MessageDataMapper.mapFromDBToDomain(messageDB))
            .filter(message => message !== undefined) as Message[];
    }

    delete(messageId: string): void {
        const record = Object.entries(this.data).find(([, message]) => message.id === messageId);
        if (record) delete this.data[record[0]];
    }
}
