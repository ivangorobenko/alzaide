import {expect} from "chai";
import {MessageDataMapper} from "../../../src/application/mapper/MessageDataMapper";
import {MessageDB} from "../../../src/application/repos/MessageDB";
import {Message} from "../../../src/domain/agregat/Message";

describe("MessageDataMapper", () => {
    it("doit permettre de mapper un objet MessageDB venant de la persistence vers une entité Message", function () {
        //GIVEN
        const messageDB: MessageDB = new MessageDB("1", "Message 1", 123);
        //WHEN
        const message: Message = MessageDataMapper.mapFromDBToDomain(messageDB);
        //THEN
        expect(message.contenu).to.be.equal(messageDB.contenu);
        expect(message.id).to.be.equal(messageDB.id);
        expect(message.timestamp).to.be.equal(messageDB.timestamp);
    });
    it("doit permettre de mapper un objet Message venant de la persistence vers MessageDB", function () {
        //GIVEN
        const message: Message = Message.create("1", "Message 1", 123).getValue();
        //WHEN
        const messageDB: MessageDB = MessageDataMapper.mapFromDomainToDB(message);
        //THEN
        expect(messageDB.contenu).to.be.equal(message.contenu);
        expect(messageDB.id).to.be.equal(message.id);
        expect(messageDB.timestamp).to.be.equal(message.timestamp);
    });
});
