import chai, {expect} from "chai";
import {IdGenerator} from "../../../src/application/IdGenerator";
import {Result} from "../../../src/core/Result";
import {Message} from "../../../src/domain/agregat/Message";
import {LaisserMessage, LaisserMessageCommandHandler} from "../../../src/domain/command/LaisserMessageCommandHandler";
import {MessageLaisseEvent} from "../../../src/domain/event/MessageLaisseEvent";
import {InMemoryMessageRepositoryImpl} from "../../../src/infrastructure/repository/InMemoryMessageRepositoryImpl";

chai.should();

describe("LaisserMessageCommandHandler", () => {
    const idGenerator = {generate: () => "myId"};

    it("doit enregistrer un message", function () {
        //GIVEN
        const messageRepository = new InMemoryMessageRepositoryImpl();
        const command = new LaisserMessage("Mon message");
        const expectedMessage = Message.create(idGenerator.generate(), "Mon message", 123).getValue();
        const sut = new LaisserMessageCommandHandler(messageRepository, {now: () => 123}, idGenerator);

        //WHEN
        sut.handle(command);

        //THEN
        const messages: Message[] = messageRepository.findAllMessages();
        expect(messages[0]).to.deep.equal(expectedMessage);
    });
    it("doit enregistrer un agrégat Message avec un identifiant unique", function () {
        //GIVEN
        const messageRepository = new InMemoryMessageRepositoryImpl();
        const command1 = new LaisserMessage("Mon message 1");
        const command2 = new LaisserMessage("Mon message 2");
        const sut = new LaisserMessageCommandHandler(messageRepository, {now: () => 123}, new IdGenerator());

        //WHEN
        const messageLaisseEvent1: Result<MessageLaisseEvent | string> = sut.handle(command1);
        const messageLaisseEvent2: Result<MessageLaisseEvent | string> = sut.handle(command2);

        //THEN
        expect((messageLaisseEvent1.getValue() as MessageLaisseEvent).id).to.not.equal(
            (messageLaisseEvent2.getValue() as MessageLaisseEvent).id
        );
    });
    it("doit renvoyer un erreur en cas d echec de traitement de la commande", function () {
        //GIVEN
        const messageRepository = new InMemoryMessageRepositoryImpl();
        const command = new LaisserMessage("");
        const sut = new LaisserMessageCommandHandler(messageRepository, {now: () => 123}, idGenerator);

        //WHEN
        const resultOrError: Result<any> = sut.handle(command);

        //THEN
        expect(resultOrError.isFailure).to.be.true;
    });
    it("doit renvoyer un événement si traitement de la commande a réussi", function () {
        //GIVEN
        const messageRepository = new InMemoryMessageRepositoryImpl();
        const command = new LaisserMessage("Mon message");
        const sut = new LaisserMessageCommandHandler(messageRepository, {now: () => 123}, idGenerator);

        //WHEN
        const resultOrError: Result<MessageLaisseEvent | string> = sut.handle(command);

        //THEN
        const result = resultOrError.getValue();
        expect(result).to.deep.equal(new MessageLaisseEvent("myId"));
    });
});
