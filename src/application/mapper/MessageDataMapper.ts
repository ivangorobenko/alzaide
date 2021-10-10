import {Message} from "../../domain/agregat/Message";
import {MessageDTO} from "../controller/MessageDTO";
import {MessageDB} from "../repos/MessageDB";

export class MessageDataMapper {
    static mapFromDBToDomain(messageDB: MessageDB): Message {
        return Message.create(messageDB.id, messageDB.contenu, messageDB.timestamp).getValue();
    }

    static mapFromDomainToDB(message: Message) {
        return new MessageDB(message.id, message.contenu, message.timestamp);
    }

    static mapFromDomainToDTO(message: Message) {
        return new MessageDTO(message.contenu, message.timestamp, message.id);
    }
}
