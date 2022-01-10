import chai, {expect} from "chai";
import {FakeUuidGenerator} from "../../../../test/FakeUuidGenerator";
import {Result} from "../../../core/Result";
import {InMemoryRepository} from "../../../infrastructure/repository/inMemory/InMemoryRepository";
import {UuidGenerator} from "../../../infrastructure/repository/UuidGenerator";
import {Message} from "../agregat/Message";
import {MessageLaisseEvent} from "../event/MessageLaisseEvent";
import {LaisserMessage, LaisserMessageCommandHandler} from "./LaisserMessageCommandHandler";

chai.should();

describe("LaisserMessageCommandHandler", () => {
    const fakeUuidGenerator = new FakeUuidGenerator();

    it("doit enregistrer un message", function () {
        //GIVEN
        const messageRepository = new InMemoryRepository<Message>(fakeUuidGenerator);
        const command = new LaisserMessage("Mon message");
        const expectedMessage = Message.create(fakeUuidGenerator.generate(), "Mon message", 123).getValue();
        const sut = new LaisserMessageCommandHandler(messageRepository, {now: () => 123}, fakeUuidGenerator);

        //WHEN
        sut.handle(command);

        //THEN
        const messages: Message[] = messageRepository.getAll();
        expect(messages[0]).to.deep.equal(expectedMessage);
    });
    it("doit enregistrer un agrégat Message avec un identifiant unique", function () {
        //GIVEN
        const messageRepository = new InMemoryRepository<Message>(fakeUuidGenerator);
        const command1 = new LaisserMessage("Mon message 1");
        const command2 = new LaisserMessage("Mon message 2");
        const sut = new LaisserMessageCommandHandler(messageRepository, {now: () => 123}, new UuidGenerator());

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
        const messageRepository = new InMemoryRepository<Message>(fakeUuidGenerator);
        const command = new LaisserMessage("");
        const sut = new LaisserMessageCommandHandler(messageRepository, {now: () => 123}, fakeUuidGenerator);

        //WHEN
        const resultOrError: Result<any> = sut.handle(command);

        //THEN
        expect(resultOrError.isFailure).to.be.true;
    });
    it("doit renvoyer un événement si traitement de la commande a réussi", function () {
        //GIVEN
        const messageRepository = new InMemoryRepository<Message>(new FakeUuidGenerator("dbId"));
        const command = new LaisserMessage("Mon message");
        const sut = new LaisserMessageCommandHandler(
            messageRepository,
            {now: () => 123},
            new FakeUuidGenerator("messageId")
        );

        //WHEN
        const resultOrError: Result<MessageLaisseEvent | string> = sut.handle(command);

        //THEN
        const result = resultOrError.getValue();
        expect(result).to.deep.equal(new MessageLaisseEvent("messageId"));
    });
});
