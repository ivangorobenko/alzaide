import {expect} from "chai";
import {InMemoryRepository} from "../../../infrastructure/repository/InMemoryRepository";
import {Message} from "../agregat/Message";
import {RecupererMessagesQuery, RecupererMessagesQueryHandler} from "./RecupererMessagesQueryHandler";

describe("Query de message", () => {
    it("doit récupérer tous les messages existant de plus récent vers moins récent", function () {
        //GIVEN
        const messageRepository = new InMemoryRepository<Message>();
        const expectedMessage1 = Message.create("1", "Message 1", 123).getValue() as Message;
        const expectedMessage2 = Message.create("2", "Message 2", 124).getValue() as Message;

        messageRepository.save("1", expectedMessage1);
        messageRepository.save("2", expectedMessage2);
        const messagesQueryHandler = new RecupererMessagesQueryHandler(messageRepository);
        //WHEN
        const resultOrError = messagesQueryHandler.handle(new RecupererMessagesQuery());

        //THEN
        expect(resultOrError.isFailure).to.be.false;
        const messages: Message[] = resultOrError.getValue();
        expect(messages.length).to.be.equals(2);
        expect(messages[0]).to.deep.equal(expectedMessage2);
        expect(messages[1]).to.deep.equal(expectedMessage1);
    });
    it("doit renvoyer la liste vide s'il n'existe aucun message", function () {
        //GIVEN
        const messageRepository = new InMemoryRepository<Message>();

        const messagesQueryHandler = new RecupererMessagesQueryHandler(messageRepository);
        //WHEN
        const resultOrError = messagesQueryHandler.handle(new RecupererMessagesQuery());

        //THEN
        const messages: Message[] = resultOrError.getValue();
        expect(messages.length).to.be.equals(0);
    });
});
