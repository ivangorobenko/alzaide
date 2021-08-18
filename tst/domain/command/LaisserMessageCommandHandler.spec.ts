import chai, {expect} from "chai";
import {Message} from "../../../src/domain/agregat/Message";
import {Result} from "../../../src/core/Result";
import {
    LaisserMessage,
    LaisserMessageCommandHandler
} from "../../../src/domain/command/LaisserMessageCommandHandler";
import {MessageLaisseEvent} from "../../../src/domain/event/MessageLaisseEvent";

chai.should()

describe("LaisserMessageCommandHandler", () => {
    it('doit enregistrer un message', function () {
        //GIVEN
        let savedMessage = undefined;
        const command = new LaisserMessage("Mon message");
        const sut = new LaisserMessageCommandHandler(command, {save: (id, message) => savedMessage = message}, {now: () => 123});

        //WHEN
        sut.handle();

        //THEN
        savedMessage.contenu.should.be.equals("Mon message");
        savedMessage.timestamp.should.be.equals(123);
    });
    it('doit enregistrer un agrégat Message', function () {
        //GIVEN
        let savedMessage: Message = undefined;
        const command = new LaisserMessage("Mon message");
        const sut = new LaisserMessageCommandHandler(command, {save: (id, message) => savedMessage = message}, {now: () => 123});

        //WHEN
        sut.handle();

        //THEN
        expect(savedMessage).to.be.an.instanceof(Message);
    });
    it('doit renvoyer un erreur en cas d echec de traitement de la commande', function () {
        //GIVEN
        let savedMessage: Message;
        const command = new LaisserMessage("");
        const sut = new LaisserMessageCommandHandler(command, {save: (id, message) => savedMessage = message}, {now: () => 123});

        //WHEN
        const resultOrError: Result<any> = sut.handle();

        //THEN
        expect(resultOrError.isFailure).to.be.true;
    });
    it('doit renvoyer un événement si traitement de la commande a réussi', function () {
        //GIVEN
        let savedMessage: Message;
        const command = new LaisserMessage("Mon message");
        const sut = new LaisserMessageCommandHandler(command, {save: (id, message) => savedMessage = message}, {now: () => 123});

        //WHEN
        const resultOrError: Result<MessageLaisseEvent> = sut.handle();

        //THEN
        expect(resultOrError.getValue()).to.be.an.instanceof(MessageLaisseEvent);
        expect(resultOrError.getValue().id).to.not.be.undefined;
    });

})
