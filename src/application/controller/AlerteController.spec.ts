import chai, {expect} from "chai";
import {Request, Response} from "express";
import {TestableCommandBus} from "../../../test/TestableCommandBus";
import {ALERTER_ACCOMPAGNANT, AlerterAccompagnant} from "../../domain/communication/command/AlerterAccompagnantHandler";
import {Lieu} from "../../domain/communication/valueObject/Lieu";
import {AlerteController} from "./AlerteController";

chai.should();

describe("AlerterController", () => {
    describe("sur l'action d'alerter l'accompagnant", () => {
        it("doit dispatcher la commande pour allerte l'accompagnant", function () {
            //GIVEN
            const commandBus: TestableCommandBus<AlerterAccompagnant> = new TestableCommandBus();
            const sut = new AlerteController(commandBus);

            //WHEN
            sut.alerterAccompagnant(
                {body: {alerte: {lieu: {latitude: 1.3, longitude: 2.4}, timestamp: 12234}}} as Request,
                {sendStatus: () => undefined} as any
            );

            //THEN
            const dispatchedCommand: AlerterAccompagnant | undefined = commandBus.dispatchedCommand;
            expect(dispatchedCommand).to.not.be.undefined;
            expect(dispatchedCommand?.type).to.be.equal(ALERTER_ACCOMPAGNANT);
            expect(dispatchedCommand?.lieu).to.be.deep.equal(new Lieu(1.3, 2.4));
            expect(dispatchedCommand?.timestamp).to.equal(12234);
        });

        it("doit renvoyer 204 si l'appel s'est correctement passé", function () {
            //GIVEN
            const commandBus: TestableCommandBus<AlerterAccompagnant> = new TestableCommandBus();
            const sut = new AlerteController(commandBus);

            //WHEN
            let expectedStatus = 0;
            const res = {
                sendStatus: (code: number) => {
                    expectedStatus = code;
                },
            } as Response;
            sut.alerterAccompagnant(
                {body: {alerte: {lieu: {latitude: 1.3, longitude: 2.4}, timestamp: 12234}}} as Request,
                res
            );
            //THEN
            expect(expectedStatus).to.be.equals(204);
        });

        it("doit renvoyer 500 si l'appel est tombé en erreur", function () {
            //GIVEN
            const commandBus: TestableCommandBus<AlerterAccompagnant> = new TestableCommandBus(true);
            const sut = new AlerteController(commandBus);

            //WHEN
            let expectedStatus = 0;
            const res = {
                sendStatus: (code: number) => {
                    expectedStatus = code;
                },
            } as Response;
            sut.alerterAccompagnant(
                {body: {alerte: {lieu: {latitude: 1.3, longitude: 2.4}, timestamp: 12234}}} as Request,
                res
            );

            //THEN
            expect(expectedStatus).to.be.equals(500);
        });
    });
});
