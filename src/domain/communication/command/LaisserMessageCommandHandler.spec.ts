import chai, {expect} from "chai";
import {idGenerator} from "../../../../test/FakeIdGenerator";
import {Result} from "../../../core/Result";
import {InMemoryRepository} from "../../../infrastructure/repository/InMemoryRepository";
import {Message} from "../agregat/Message";
import {MessageLaisseEvent} from "../event/MessageLaisseEvent";
import {IdGenerator} from "../repository/IdGenerator";
import {LaisserMessage, LaisserMessageCommandHandler} from "./LaisserMessageCommandHandler";

chai.should();

describe("LaisserMessageCommandHandler", () => {
    it("doit enregistrer un message", function () {
        //GIVEN
        const messageRepository = new InMemoryRepository<Message>();
        const command = new LaisserMessage("Mon message");
        const expectedMessage = Message.create(idGenerator.generate(), "Mon message", 123).getValue();
        const sut = new LaisserMessageCommandHandler(messageRepository, {now: () => 123}, idGenerator);

        //WHEN
        sut.handle(command);

        //THEN
        const messages: Message[] = messageRepository.getAll();
        expect(messages[0]).to.deep.equal(expectedMessage);
    });
    it("doit enregistrer un agrégat Message avec un identifiant unique", function () {
        //GIVEN
        const messageRepository = new InMemoryRepository<Message>();
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
        const messageRepository = new InMemoryRepository<Message>();
        const command = new LaisserMessage("");
        const sut = new LaisserMessageCommandHandler(messageRepository, {now: () => 123}, idGenerator);

        //WHEN
        const resultOrError: Result<any> = sut.handle(command);

        //THEN
        expect(resultOrError.isFailure).to.be.true;
    });
    it("doit renvoyer un événement si traitement de la commande a réussi", function () {
        //GIVEN
        const messageRepository = new InMemoryRepository<Message>();
        const command = new LaisserMessage("Mon message");
        const sut = new LaisserMessageCommandHandler(messageRepository, {now: () => 123}, idGenerator);

        //WHEN
        const resultOrError: Result<MessageLaisseEvent | string> = sut.handle(command);

        //THEN
        const result = resultOrError.getValue();
        expect(result).to.deep.equal(new MessageLaisseEvent("myId"));
    });
});
