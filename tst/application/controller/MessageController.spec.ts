// @ts-ignore
import chai, {expect} from "chai";
import {Request, Response} from "express";
import {MessageController} from "../../../src/application/controller/MessageController";
import {CommandBus} from "../../../src/core/CommandBus";
import {QueryBus} from "../../../src/core/QueryBus";
import {Message} from "../../../src/domain/agregat/Message";
import {LAISSER_MESSAGE} from "../../../src/domain/command/LaisserMessageCommandHandler";
import {SUPPRIMER_MESSAGE} from "../../../src/domain/command/SupprimerMessageCommandHandler";
import {RECUPERER_MESSAGES} from "../../../src/domain/query/MessagesQueryHandler";
import {TestableCommandBus} from "./TestableCommandBus";
import {TestableQueryBus} from "./TestableQueryBus";
import exp = require("constants");
import {StatusCodes} from "http-status-codes";

chai.should();

describe("MessageController", () => {
    describe("sur l'action laisserMessage", () => {
        it("doit dispatcher la commande pour laisser un message", function () {
            //GIVEN
            const commandBus: TestableCommandBus = new TestableCommandBus();
            const sut = new MessageController(commandBus, {} as QueryBus);

            //WHEN
            sut.laisserMessage(
                {body: {message: "Mon message"}} as Request,
                {sendStatus: (code: number) => undefined} as Response
            );

            //THEN
            expect(commandBus.dispatchedCommand).to.not.be.undefined;
            expect(commandBus.dispatchedCommand.type).to.be.equal(LAISSER_MESSAGE);
            // @ts-ignore
            expect(commandBus.dispatchedCommand.message).to.be.equal("Mon message");
        });

        it("doit renvoyer 204 si l'appel s'est correctement passé", function () {
            //GIVEN
            const commandBus: TestableCommandBus = new TestableCommandBus();
            const sut = new MessageController(commandBus, {} as QueryBus);

            //WHEN
            let expectedStatus = 0;
            const res = {
                sendStatus: (code: number) => {
                    expectedStatus = code;
                },
            } as Response;
            sut.laisserMessage({body: {message: "Mon message"}} as Request, res);

            //THEN
            expect(expectedStatus).to.be.equals(204);
        });

        it("doit renvoyer 500 si l'appel est tombé en erreur", function () {
            //GIVEN
            const commandBus: TestableCommandBus = new TestableCommandBus(true);
            const sut = new MessageController(commandBus, {} as QueryBus);

            //WHEN
            let resultStatusCode = 0;
            const res = {
                sendStatus: (code: number) => {
                    resultStatusCode = code;
                },
            } as Response;
            sut.laisserMessage({body: {message: ""}} as Request, res);

            //THEN
            expect(resultStatusCode).to.be.equals(500);
        });
    });
    describe("sur l'action recupererMessages", () => {
        it("doit dispatcher la query pour récupérer l'ensemble de messages", function () {
            //GIVEN
            const messages = [Message.create("1", "Message 1", 123), Message.create("2", "Message 2", 123)];
            const queryBus: TestableQueryBus = new TestableQueryBus(false, messages);
            const sut = new MessageController({} as CommandBus, queryBus);

            //WHEN
            sut.recupererMessages(
                {} as Request,
                {
                    status: (code: number) => ({
                        send: () => undefined,
                    }),
                } as Response
            );

            //THEN
            expect(queryBus.dispatchedQuery).to.not.be.undefined;
            expect(queryBus.dispatchedQuery.type).to.be.equal(RECUPERER_MESSAGES);
        });
        it("doit renvoyer le code http 200 et la liste de messages quand l'opération s'est bien passée", function () {
            //GIVEN

            const message1 = Message.create("1", "Message 1", 123).getValue();
            const message2 = Message.create("2", "Message 2", 123).getValue();
            const queryBus: TestableQueryBus = new TestableQueryBus(false, [message1, message2]);
            const sut = new MessageController({} as CommandBus, queryBus);

            //WHEN
            let messagesRecuperes;
            let statusEnvoyé;
            sut.recupererMessages(undefined, {
                status: (status: number) => {
                    statusEnvoyé = status;
                    return {
                        send: (body: any) => {
                            messagesRecuperes = body;
                        },
                    };
                },
            });

            //THEN
            expect(messagesRecuperes[0].contenu).to.be.equal(message1.contenu);
            expect(messagesRecuperes[0].contenu).to.be.equal(message1.contenu);
            expect(messagesRecuperes[1].timestamp).to.be.equal(message2.timestamp);
            expect(messagesRecuperes[1].timestamp).to.be.equal(message2.timestamp);
            expect(statusEnvoyé).to.be.equal(200);
        });

        it("doit renvoyer code 500 l'opération est tombée en échec", function () {
            //GIVEN
            const queryBus: TestableQueryBus = new TestableQueryBus(true);
            const sut = new MessageController({} as CommandBus, queryBus);

            //WHEN
            let statusEnvoyé;
            sut.recupererMessages(
                {} as Request,
                {
                    sendStatus: (status: number) => {
                        statusEnvoyé = status;
                    },
                } as Response
            );

            //THEN

            expect(statusEnvoyé).to.be.equal(500);
        });
    });
    describe("sur l'action supprimerMessage", function () {
        it("doit dispatcher la commande SupprimerMessage", () => {
            //GIVEN
            const commandBus: TestableCommandBus = new TestableCommandBus();
            const sut = new MessageController(commandBus, {} as QueryBus);

            //WHEN
            sut.supprimerMessage({params: {id: "1"}} as Request, {sendStatus: (code: number) => undefined} as Response);

            //THEN
            expect(commandBus.dispatchedCommand).to.not.be.undefined;
            expect(commandBus.dispatchedCommand.type).to.be.equal(SUPPRIMER_MESSAGE);
            // @ts-ignore
            expect(commandBus.dispatchedCommand.id).to.be.equal("1");
        });
        it("doit renvoyer 204 si la suppression s'est correctement déroulée", () => {
            //GIVEN
            const commandBus: TestableCommandBus = new TestableCommandBus();
            const sut = new MessageController(commandBus, {} as QueryBus);
            let responseCode;

            //WHEN
            sut.supprimerMessage(
                {params: {id: "1"}} as Request,
                {
                    sendStatus: (code: number) => {
                        responseCode = code;
                    },
                } as Response
            );

            //THEN
            expect(responseCode).to.be.equal(204);
        });
    });
    it("doit renvoyer Bad request si le traitement de la commande renvoie un échec", () => {
        //GIVEN
        const commandBus: TestableCommandBus = new TestableCommandBus(true);
        const sut = new MessageController(commandBus, {} as QueryBus);
        let responseCode;

        //WHEN
        sut.supprimerMessage(
            {params: {id: "1"}} as Request,
            {
                sendStatus: (code: number) => {
                    responseCode = code;
                },
            } as Response
        );

        //THEN
        expect(responseCode).to.be.equal(StatusCodes.BAD_REQUEST);
    });
});
