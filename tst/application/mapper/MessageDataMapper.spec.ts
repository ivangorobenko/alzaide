import {expect} from "chai";
import {MessageDTO} from "../../../src/application/controller/MessageDTO";
import {MessageDataMapper} from "../../../src/application/mapper/MessageDataMapper";
import {Message} from "../../../src/domain/communication/agregat/Message";
import {MessageDB} from "../../../src/infrastructure/repository/MessageDB";

describe("MessageDataMapper", () => {
    describe("objet MessageDB venant de la persistence vers une entité Message", function () {
        it("doit renvoyer Message si tout se passe bien", function () {
            //GIVEN
            const messageDB: MessageDB = new MessageDB("1", "Message 1", 123);
            //WHEN
            const message = MessageDataMapper.mapFromDBToDomain(messageDB) as Message;
            //THEN
            expect(message.contenu).to.be.equal(messageDB.contenu);
            expect(message.id).to.be.equal(messageDB.id);
            expect(message.timestamp).to.be.equal(messageDB.timestamp);
        });

        it("doit renvoyer undefined si un problème survient", function () {
            //GIVEN
            const messageDB: MessageDB = new MessageDB("", "Message 1", 123);
            //WHEN
            const message = MessageDataMapper.mapFromDBToDomain(messageDB) as Message;
            //THEN
            expect(message).to.be.undefined;
        });
    });
    it("doit permettre de mapper un objet Message vers MessageDB en direction de la persistance", function () {
        //GIVENl
        const message: Message = Message.create("1", "Message 1", 123).getValue() as Message;
        //WHEN
        const messageDB: MessageDB = MessageDataMapper.mapFromDomainToDB(message);
        //THEN
        expect(messageDB.contenu).to.be.equal(message.contenu);
        expect(messageDB.id).to.be.equal(message.id);
        expect(messageDB.timestamp).to.be.equal(message.timestamp);
    });

    it("doit permettre de mapper un objet Message vers MessageDTO en direction de UI", function () {
        //GIVEN
        const message: Message = Message.create("1", "Message 1", 123).getValue() as Message;
        //WHEN
        const messageDTO: MessageDTO = MessageDataMapper.mapFromDomainToDTO(message);
        //THEN
        expect(messageDTO.contenu).to.be.equal(message.contenu);
        expect(messageDTO.timestamp).to.be.equal(message.timestamp);
        expect(messageDTO.id).to.be.equal(message.id);
    });
});
