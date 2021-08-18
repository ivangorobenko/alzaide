import {Message} from "../../../src/domain/agregat/Message";
import {expect} from "chai";
import {Result} from "../../../src/core/Result";


describe("Agrégat Message", () => {
    it.skip('doit créer un message avec une date, contenu et identifiant', function () {
        //GIVEN
        const timestamp = 123;
        const contenu = "Mon message 1"
        //WHEN
        const messageOuErreur1: Result<Message> = Message.create(contenu, timestamp);
        const message1: Message = messageOuErreur1.getValue();
        //THEN
        expect(message1.id).to.not.be.undefined;
        expect(message1.timestamp).to.be.equals(timestamp);
        expect(message1.contenu).to.be.equals(contenu);
    });
    it('doit générer un identifiant unique', function () {
        //GIVEN
        //WHEN
        const messageOuErreur1: Result<Message> = Message.create("Mon message 1",1);
        const message1: Message = messageOuErreur1.getValue();
        const messageOuErreur2: Result<Message> = Message.create("Mon message 2",2);
        const message2: Message = messageOuErreur2.getValue();

        //THEN
        expect(message1.id).to.not.be.undefined;
        expect(message2.id).to.not.be.undefined;
        expect(message1.id).to.not.equal(message2.id)
    });
    it('ne doit permettre de créer un message avec le contenu vide', function () {
        //GIVEN
        //WHEN
        const messageOuErreur: Result<Message> = Message.create("",1);

        //THEN
        expect(messageOuErreur.isFailure).to.be.true;
    });
    it('ne doit permettre de créer un message avec une date vide', function () {
        //GIVEN
        //WHEN
        const messageOuErreur: Result<Message> = Message.create("Mon message");

        //THEN
        expect(messageOuErreur.isFailure).to.be.true;
    });
});