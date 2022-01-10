import {MessageDataMapper} from "../../../application/mapper/MessageDataMapper";
import {Message} from "../../../domain/communication/agregat/Message";
import {IdGenerator} from "../../../domain/communication/repository/IdGenerator";
import {MessageRepository} from "../../../domain/communication/repository/MessageRepository";
import {MessageDB} from "../dto/MessageDB";
import {readFile, syncPersistence} from "./file";

export class FileMessageRepository implements MessageRepository {
    private readonly filePath: string;
    protected readonly data: {[name: string]: MessageDB};
    protected idGenerator: IdGenerator;

    constructor(path: string, idGenerator: any) {
        this.idGenerator = idGenerator;
        this.filePath = path;
        this.data = readFile(path) || {};
    }

    async save(value: Message): Promise<void> {
        this.data[this.idGenerator.generate()] = MessageDataMapper.mapFromDomainToDB(value);
        return syncPersistence(this.filePath, this.data);
    }

    getAll(): Message[] {
        return Object.values(this.data)
            .map(messageDB => MessageDataMapper.mapFromDBToDomain(messageDB))
            .filter(message => message !== undefined) as Message[];
    }

    async delete(messageId: string): Promise<void> {
        const record = Object.entries(this.data).find(([, message]) => message.id === messageId);
        if (record) delete this.data[record[0]];
        return syncPersistence(this.filePath, this.data);
    }
}
