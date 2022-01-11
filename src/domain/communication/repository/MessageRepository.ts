import {Repository} from "../../../core/Repository";
import {Message} from "../agregat/Message";

export interface MessageRepository extends Repository<Message> {
    delete(id: string): void;
    getAll(): Message[];
}
