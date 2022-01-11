import {expect} from "chai";
import {InMemoryMessageRepository} from "../../../infrastructure/repository/inMemory/InMemoryMessageRepository";
import {UuidGenerator} from "../../../infrastructure/repository/UuidGenerator";
import {Message} from "../agregat/Message";
import {RecupererMessagesQuery, RecupererMessagesQueryHandler} from "./RecupererMessagesQueryHandler";

describe("Query de message", () => {
    const fakeUuidGenerator = new UuidGenerator();
    it("doit récupérer tous les messages existant de plus récent vers moins récent", function () {
        //GIVEN
        const messageRepository = new InMemoryMessageRepository(fakeUuidGenerator);
        const expectedMessage1 = Message.create("1", "Message 1", 123).getValue() as Message;
        const expectedMessage2 = Message.create("2", "Message 2", 124).getValue() as Message;

        messageRepository.save(expectedMessage1);
        messageRepository.save(expectedMessage2);
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
        const messageRepository = new InMemoryMessageRepository(fakeUuidGenerator);

        const messagesQueryHandler = new RecupererMessagesQueryHandler(messageRepository);
        //WHEN
        const resultOrError = messagesQueryHandler.handle(new RecupererMessagesQuery());

        //THEN
        const messages: Message[] = resultOrError.getValue();
        expect(messages.length).to.be.equals(0);
    });
});
