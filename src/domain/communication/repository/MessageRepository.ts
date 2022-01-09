import {Repository} from "../../../core/Repository";
import {MessageDB} from "../../../infrastructure/repository/MessageDB";

export interface MessageRepository extends Repository<MessageDB> {
    delete(id: string): void;
}
