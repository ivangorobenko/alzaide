import chai, {expect} from "chai";
import {CommandResponse} from "../../../src/core/CommandResponse";
import {Result} from "../../../src/core/Result";
import {Message} from "../../../src/domain/agregat/Message";
import {
    SupprimerMessage,
    SupprimerMessageCommandHandler,
} from "../../../src/domain/command/SupprimerMessageCommandHandler";
import {MessageSupprimeEvent} from "../../../src/domain/event/MessageSupprimeEvent";
import {InMemoryMessageRepositoryImpl} from "../../../src/infrastructure/repository/InMemoryMessageRepositoryImpl";

chai.should();

describe("SupprimerMessageCommandHandler", () => {
    it("doit supprimer un message avec son identifiant", function () {
        //GIVEN
        const messageRepository = new InMemoryMessageRepositoryImpl();
        messageRepository.save("123", Message.create("123", "Mon message", 123).getValue() as Message);
        expect(messageRepository.findAllMessages().length).to.equal(1);
        const command = new SupprimerMessage("123");
        const sut = new SupprimerMessageCommandHandler(messageRepository);

        //WHEN
        sut.handle(command);

        //THEN
        expect(messageRepository.findAllMessages().length).to.equal(0);
    });
    it("doit renvoyer un erreur si l'id est absent dans la commande", function () {
        //GIVEN
        const command = new SupprimerMessage("");
        const sut = new SupprimerMessageCommandHandler(new InMemoryMessageRepositoryImpl());

        //WHEN
        const resultOrError: Result<any> = sut.handle(command);

        //THEN
        expect(resultOrError.isFailure).to.be.true;
    });

    it("doit renvoyer un événement si traitement de la commande a réussi", function () {
        //GIVEN
        const command = new SupprimerMessage("123");
        const sut = new SupprimerMessageCommandHandler(new InMemoryMessageRepositoryImpl());

        //WHEN
        const resultOrError: CommandResponse = sut.handle(command);

        //THEN
        const result = resultOrError.getValue();
        expect(result).to.deep.equal(new MessageSupprimeEvent("123"));
    });
});
