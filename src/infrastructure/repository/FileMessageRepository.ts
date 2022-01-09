import {MessageDataMapper} from "../../application/mapper/MessageDataMapper";
import {Message} from "../../domain/communication/agregat/Message";
import {MessageRepository} from "../../domain/communication/repository/MessageRepository";
import {FileRepository} from "./FileRepository";
import {MessageDB} from "./MessageDB";

export class FileMessageRepository extends FileRepository<MessageDB> implements MessageRepository {
    async save(value: Message): Promise<void> {
        this.data[this.idGenerator.generate()] = MessageDataMapper.mapFromDomainToDB(value);
        return this.syncPersistence();
    }

    getAll(): Message[] {
        return Object.values(this.data)
            .map(messageDB => MessageDataMapper.mapFromDBToDomain(messageDB))
            .filter(message => message !== undefined) as Message[];
    }

    get(id: string): Message {
        return MessageDataMapper.mapFromDBToDomain(this.data[id]) as Message;
    }

    async delete(id: string): Promise<void> {
        delete this.data[id];
        return this.syncPersistence();
    }
}
