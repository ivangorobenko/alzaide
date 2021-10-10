import {Message} from "../../domain/agregat/Message";
import {Repository} from "./Repository";

export interface MessageRepository extends Repository<Message> {
    findAllMessages(): Message[];
}