// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import chai, {expect} from "chai";
import {Result} from "../../../src/core/Result";
import {
    SupprimerMessage,
    SupprimerMessageCommandHandler
} from "../../../src/domain/command/SupprimerMessageCommandHandler";
import {MessageSupprimeEvent} from "../../../src/domain/event/MessageSupprimeEvent";

chai.should();

describe("SupprimerMessageCommandHandler", () => {
    it("doit supprimer un message avec son identifiant", function () {
        //GIVEN
        let deletedMessageId = undefined;
        const command = new SupprimerMessage("123");
        const sut = new SupprimerMessageCommandHandler({delete: id => (deletedMessageId = id)});

        //WHEN
        sut.handle(command);

        //THEN
        deletedMessageId.should.be.equals("123");
    });
    it("doit renvoyer un erreur en cas si l'id est vide dans la commande", function () {
        //GIVEN
        let deletedMessageId = undefined;
        const command = new SupprimerMessage("");
        const sut = new SupprimerMessageCommandHandler(undefined);

        //WHEN
        const resultOrError: Result<any> = sut.handle(command);

        //THEN
        expect(resultOrError.isFailure).to.be.true;
    });
    it("doit renvoyer un erreur en cas si l'id est absent dans la commande", function () {
        //GIVEN
        let deletedMessageId = undefined;
        // @ts-ignore
        const command = new SupprimerMessage();
        const sut = new SupprimerMessageCommandHandler(undefined);

        //WHEN
        const resultOrError: Result<any> = sut.handle(command);

        //THEN
        expect(resultOrError.isFailure).to.be.true;
    });

    it("doit renvoyer un événement si traitement de la commande a réussi", function () {
        //GIVEN
        let deletedMessageId = undefined;
        const command = new SupprimerMessage("123");
        const sut = new SupprimerMessageCommandHandler({delete: id => (deletedMessageId = id)});

        //WHEN
        const resultOrError: Result<MessageSupprimeEvent> = sut.handle(command);

        //THEN
        expect(resultOrError.getValue()).to.be.an.instanceof(MessageSupprimeEvent);
        expect(resultOrError.getValue().id).to.not.be.undefined;
    });
});
