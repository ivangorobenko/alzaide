import {MessageDataMapper} from "../../application/mapper/MessageDataMapper";
import {Message} from "../../domain/communication/agregat/Message";
import {MessageRepository} from "../../domain/communication/repository/MessageRepository";
import {copyFileIfNotExist, readFile, writeFile} from "./file";
import {MessageDB} from "./MessageDB";

export class FileMessageRepository implements MessageRepository {
    private readonly filePath: string;
    private readonly data: {[name: string]: MessageDB};

    constructor(path: string, defaultPath = "") {
        copyFileIfNotExist(defaultPath, path);
        this.filePath = path;
        this.data = readFile(path) || {};
    }

    async save(id: string, value: Message): Promise<void> {
        this.data[id] = MessageDataMapper.mapFromDomainToDB(value);
        return this.syncPersistence();
    }

    async delete(id: string): Promise<void> {
        delete this.data[id];
        return this.syncPersistence();
    }

    async syncPersistence(): Promise<void> {
        writeFile(this.filePath, this.data);
    }

    getAll(): Message[] {
        return Object.values(this.data)
            .map(messageDB => MessageDataMapper.mapFromDBToDomain(messageDB))
            .filter(message => message !== undefined) as Message[];
    }

    get(id: string): Message {
        return MessageDataMapper.mapFromDBToDomain(this.data[id]) as Message;
    }
}
