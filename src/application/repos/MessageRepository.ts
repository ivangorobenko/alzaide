import {Repository} from "./Repository";
import {Message} from "../../domain/agregat/Message";

export interface MessageRepository extends Repository<Message> {
    findAllMessages(): Message[];
}