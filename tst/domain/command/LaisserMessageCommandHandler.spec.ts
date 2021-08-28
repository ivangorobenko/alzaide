// @ts-ignore
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
        const sut = new LaisserMessageCommandHandler({save: (id, message) => savedMessage = message}, {now: () => 123});

        //WHEN
        sut.handle(command);

        //THEN
        savedMessage.contenu.should.be.equals("Mon message");
        savedMessage.timestamp.should.be.equals(123);
        expect(savedMessage).to.be.an.instanceof(Message);

    });
    it('doit enregistrer un agrégat Message avec un identifiant unique', function () {
        //GIVEN
        const ids = [];
        const command1 = new LaisserMessage("Mon message 1");
        const command2 = new LaisserMessage("Mon message 2");
        // @ts-ignore
        const sut = new LaisserMessageCommandHandler({
            save: (id, message) => {
                ids.push(id);
            }
        }, {now: () => 123});

        //WHEN
        sut.handle(command1);
        sut.handle(command2);

        //THEN
        expect(ids[0]).to.not.be.equal(ids[1]);
    });
    it('doit renvoyer un erreur en cas d echec de traitement de la commande', function () {
        //GIVEN
        let savedMessage: Message;
        const command = new LaisserMessage("");
        const sut = new LaisserMessageCommandHandler({save: (id, message) => savedMessage = message}, {now: () => 123});

        //WHEN
        const resultOrError: Result<any> = sut.handle(command);

        //THEN
        expect(resultOrError.isFailure).to.be.true;
    });
    it('doit renvoyer un événement si traitement de la commande a réussi', function () {
        //GIVEN
        let savedMessage: Message;
        const command = new LaisserMessage("Mon message");
        const sut = new LaisserMessageCommandHandler({save: (id, message) => savedMessage = message}, {now: () => 123});

        //WHEN
        const resultOrError: Result<MessageLaisseEvent> = sut.handle(command);

        //THEN
        expect(resultOrError.getValue()).to.be.an.instanceof(MessageLaisseEvent);
        expect(resultOrError.getValue().id).to.not.be.undefined;
    });

})
