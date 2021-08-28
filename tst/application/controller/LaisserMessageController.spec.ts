import chai, {expect} from "chai";

import {LaisserMessageController} from "../../../src/application/controller/LaisserMessageController";
import {Request, Response} from "express";
import {LAISSER_MESSAGE} from "../../../src/domain/command/LaisserMessageCommandHandler";
import {TestableCommandBus} from "./TestableCommandBus";

chai.should();

describe("LaisserMessageController", () => {
    it('doit dispatcher la commande pour laisser un message', function () {
        //GIVEN
        const commandBus: TestableCommandBus = new TestableCommandBus();
        const sut = new LaisserMessageController(commandBus);

        //WHEN
        sut.laisserMessage({body: {message: "Mon message"}} as Request, {sendStatus: (code: number) => undefined} as Response);

        //THEN
        expect(commandBus.dispatchedCommand).to.not.be.undefined;
        expect(commandBus.dispatchedCommand.type).to.be.equal(LAISSER_MESSAGE);
        expect(commandBus.dispatchedCommand.contenu).to.be.equal("Mon message");
    });

    it("doit renvoyer 200 si l'appel s'est correctement passé", function () {
        //GIVEN
        const commandBus: TestableCommandBus = new TestableCommandBus();
        const sut = new LaisserMessageController(commandBus);

        //WHEN
        let expectedStatus: number = 0;
        let res = {
            sendStatus: (code: number) => {
                expectedStatus = code;
            }
        } as Response;
        sut.laisserMessage({body: {message: "Mon message"}} as Request, res);

        //THEN
        expect(expectedStatus).to.be.equals(200);
    });

    it("doit renvoyer 500 si l'appel est tombé en erreur", function () {
        //GIVEN
        const commandBus: TestableCommandBus = new TestableCommandBus(true);
        const sut = new LaisserMessageController(commandBus);

        //WHEN
        let resultStatusCode: number = 0;
        let res = {
            sendStatus: (code: number) => {
                resultStatusCode = code;
            }
        } as Response;
        sut.laisserMessage({body: {message: ""}} as Request, res);

        //THEN
        expect(resultStatusCode).to.be.equals(500);
    });
})