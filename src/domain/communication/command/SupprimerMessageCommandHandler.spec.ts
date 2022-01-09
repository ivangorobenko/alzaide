import chai, {expect} from "chai";
import {CommandResponse} from "../../../core/CommandResponse";
import {Result} from "../../../core/Result";
import {InMemoryMessageRepository} from "../../../infrastructure/repository/InMemoryMessageRepository";
import {Message} from "../agregat/Message";
import {MessageSupprimeEvent} from "../event/MessageSupprimeEvent";
import {SupprimerMessage, SupprimerMessageCommandHandler} from "./SupprimerMessageCommandHandler";

chai.should();

describe("SupprimerMessageCommandHandler", () => {
    it("doit supprimer un message avec son identifiant", function () {
        //GIVEN
        const messageRepository = new InMemoryMessageRepository();
        messageRepository.save("123", Message.create("123", "Mon message", 123).getValue() as Message);
        expect(messageRepository.getAll().length).to.equal(1);
        const command = new SupprimerMessage("123");
        const sut = new SupprimerMessageCommandHandler(messageRepository);

        //WHEN
        sut.handle(command);

        //THEN
        expect(messageRepository.getAll().length).to.equal(0);
    });
    it("doit renvoyer un erreur si l'id est absent dans la commande", function () {
        //GIVEN
        const command = new SupprimerMessage("");
        const sut = new SupprimerMessageCommandHandler(new InMemoryMessageRepository());

        //WHEN
        const resultOrError: Result<any> = sut.handle(command);

        //THEN
        expect(resultOrError.isFailure).to.be.true;
    });

    it("doit renvoyer un événement si traitement de la commande a réussi", function () {
        //GIVEN
        const command = new SupprimerMessage("123");
        const sut = new SupprimerMessageCommandHandler(new InMemoryMessageRepository());

        //WHEN
        const resultOrError: CommandResponse = sut.handle(command);

        //THEN
        const result = resultOrError.getValue();
        expect(result).to.deep.equal(new MessageSupprimeEvent("123"));
    });
});
