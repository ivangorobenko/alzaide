import {expect} from "chai";
import {Result} from "../../../src/core/Result";
import {Message} from "../../../src/domain/agregat/Message";

describe("Agrégat Message", () => {
    it("doit créer un message avec une date, contenu et identifiant", function () {
        //GIVEN
        const timestamp = 123;
        const contenu = "Mon message 1";
        const id = "1";
        //WHEN
        const messageOuErreur1: Result<Message | string> = Message.create(id, contenu, timestamp);
        const message1: Message = messageOuErreur1.getValue() as Message;
        //THEN
        expect(message1.id).to.be.equal(id);
        expect(message1.timestamp).to.be.equal(timestamp);
        expect(message1.contenu).to.be.equal(contenu);
    });
    it("ne doit permettre de créer un message avec l'identifiant vide", function () {
        //GIVEN
        //WHEN
        const messageOuErreur1: Result<Message | string> = Message.create("", "Mon message 1", 1);

        //THEN
        expect(messageOuErreur1.isFailure).to.be.true;
    });
    it("ne doit pas permettre de créer un message avec le contenu vide", function () {
        //GIVEN
        //WHEN
        const messageOuErreurCasVide: Result<Message | string> = Message.create("123", "", 1);

        //THEN
        expect(messageOuErreurCasVide.isFailure).to.be.true;
    });
    it("ne doit permettre de créer un message avec une date invalide", function () {
        //GIVEN
        //WHEN
        const messageOuErreur: Result<Message | string> = Message.create("1", "Mon message", 0);

        //THEN
        expect(messageOuErreur.isFailure).to.be.true;
    });
});
