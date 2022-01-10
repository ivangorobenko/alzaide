import {Message} from "../../domain/communication/agregat/Message";
import {MessageDB} from "../../infrastructure/repository/dto/MessageDB";
import {MessageDTO} from "../controller/MessageDTO";

export class MessageDataMapper {
    static mapFromDBToDomain(messageDB: MessageDB): Message | undefined {
        const result = Message.create(messageDB.id, messageDB.contenu, messageDB.timestamp);
        if (result.isSuccess) return result.getValue() as Message;
        return undefined;
    }

    static mapFromDomainToDB(message: Message) {
        return new MessageDB(message.id, message.contenu, message.timestamp);
    }

    static mapFromDomainToDTO(message: Message) {
        return new MessageDTO(message.id, message.contenu, message.timestamp);
    }
}
