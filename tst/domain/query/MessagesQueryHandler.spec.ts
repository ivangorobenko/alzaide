import {expect} from "chai";
import {InMemoryMessageRepositoryImpl} from "../../../src/application/repos/InMemoryMessageRepositoryImpl";
import {MessageRepository} from "../../../src/application/repos/MessageRepository";
import {Result} from "../../../src/core/Result";
import {Message} from "../../../src/domain/agregat/Message";
import {MessagesQuery, MessagesQueryHandler} from "../../../src/domain/query/MessagesQueryHandler";

describe("Query de message", () => {
    it("doit récupérer tous les messages existant", function () {
        //GIVEN
        const repository: MessageRepository = new InMemoryMessageRepositoryImpl();
        const messageOrError1: Result<Message> = Message.create("1", "Message 1", 123);
        const messageOrError2: Result<Message> = Message.create("2", "Message 2", 124);

        repository.save("1", messageOrError1.getValue());
        repository.save("2", messageOrError2.getValue());
        const messagesQueryHandler = new MessagesQueryHandler(repository);
        //WHEN
        const resultOrError = messagesQueryHandler.handle(new MessagesQuery());

        //THEN
        expect(resultOrError.isFailure).to.be.false;
        const messages: Message[] = resultOrError.getValue();
        expect(messages.length).to.be.equals(2);
        const message1: Message = messages[0];
        expect(message1.id).to.be.equals("1");
        expect(message1.contenu).to.be.equals("Message 1");
        expect(message1.timestamp).to.be.equals(123);
        const message2: Message = messages[1];
        expect(message2.id).to.be.equals("2");
        expect(message2.contenu).to.be.equals("Message 2");
        expect(message2.timestamp).to.be.equals(124);
    });
    it("doit renvoyer la liste vide s'il n'existe aucun message", function () {
        //GIVEN
        const repository: MessageRepository = new InMemoryMessageRepositoryImpl();

        const messagesQueryHandler = new MessagesQueryHandler(repository);
        //WHEN
        const resultOrError = messagesQueryHandler.handle(new MessagesQuery());

        //THEN
        expect(resultOrError.isFailure).to.be.true;
        const messages: Message[] = resultOrError.getValue();
        expect(messages.length).to.be.equals(0);
    });
});
