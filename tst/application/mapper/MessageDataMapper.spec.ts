import {expect} from "chai";
import {MessageDataMapper} from "../../../src/application/mapper/MessageDataMapper";
import {MessageDB} from "../../../src/application/repos/MessageDB";
import {Message} from "../../../src/domain/agregat/Message";
import {MessageDTO} from "../../../src/application/controller/MessageDTO";

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
    it("doit permettre de mapper un objet Message vers MessageDB en direction de la persistance", function () {
        //GIVEN
        const message: Message = Message.create("1", "Message 1", 123).getValue();
        //WHEN
        const messageDB: MessageDB = MessageDataMapper.mapFromDomainToDB(message);
        //THEN
        expect(messageDB.contenu).to.be.equal(message.contenu);
        expect(messageDB.id).to.be.equal(message.id);
        expect(messageDB.timestamp).to.be.equal(message.timestamp);
    });

    it("doit permettre de mapper un objet Message vers MessageDTO en direction de UI", function () {
        //GIVEN
        const message: Message = Message.create("1", "Message 1", 123).getValue();
        //WHEN
        const messageDTO: MessageDTO = MessageDataMapper.mapFromDomainToDTO(message);
        //THEN
        expect(messageDTO.contenu).to.be.equal(message.contenu);
        expect(messageDTO.timestamp).to.be.equal(message.timestamp);
        expect(messageDTO.id).to.be.equal(message.id);
    });
});
