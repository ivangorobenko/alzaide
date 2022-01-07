import {expect} from "chai";
import {MessageRepository} from "../../../src/application/repos/MessageRepository";
import {Message} from "../../../src/domain/agregat/Message";
import {
    RecupererMessagesQuery,
    RecupererMessagesQueryHandler,
} from "../../../src/domain/query/RecupererMessagesQueryHandler";
import {InMemoryMessageRepositoryImpl} from "../../../src/infrastructure/repository/InMemoryMessageRepositoryImpl";

describe("Query de message", () => {
    it("doit récupérer tous les messages existant", function () {
        //GIVEN
        const repository: MessageRepository = new InMemoryMessageRepositoryImpl();
        const expectedMessage1 = Message.create("1", "Message 1", 123).getValue() as Message;
        const expectedMessage2 = Message.create("2", "Message 2", 124).getValue() as Message;

        repository.save("1", expectedMessage1);
        repository.save("2", expectedMessage2);
        const messagesQueryHandler = new RecupererMessagesQueryHandler(repository);
        //WHEN
        const resultOrError = messagesQueryHandler.handle(new RecupererMessagesQuery());

        //THEN
        expect(resultOrError.isFailure).to.be.false;
        const messages: Message[] = resultOrError.getValue();
        expect(messages.length).to.be.equals(2);
        expect(messages[0]).to.deep.equal(expectedMessage1);
        expect(messages[1]).to.deep.equal(expectedMessage2);
    });
    it("doit renvoyer la liste vide s'il n'existe aucun message", function () {
        //GIVEN
        const repository: MessageRepository = new InMemoryMessageRepositoryImpl();

        const messagesQueryHandler = new RecupererMessagesQueryHandler(repository);
        //WHEN
        const resultOrError = messagesQueryHandler.handle(new RecupererMessagesQuery());

        //THEN
        const messages: Message[] = resultOrError.getValue();
        expect(messages.length).to.be.equals(0);
    });
});
