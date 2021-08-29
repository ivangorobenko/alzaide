// @ts-ignore
import chai, {expect} from "chai";

import {MessageController} from "../../../src/application/controller/MessageController";
import {Request, Response} from "express";
import {LAISSER_MESSAGE} from "../../../src/domain/command/LaisserMessageCommandHandler";
import {TestableCommandBus} from "./TestableCommandBus";
import {RECUPERER_MESSAGES} from "../../../src/domain/query/MessagesQueryHandler";
import {TestableQueryBus} from "./TestableQueryBus";
import {CommandBus} from "../../../src/core/CommandBus";
import {QueryBus} from "../../../src/core/QueryBus";

chai.should();

describe("MessageController", () => {
    describe("sur l'action laisserMessage", () => {
        it('doit dispatcher la commande pour laisser un message', function () {
            //GIVEN
            const commandBus: TestableCommandBus = new TestableCommandBus();
            const sut = new MessageController(commandBus, {} as QueryBus);

            //WHEN
            sut.laisserMessage({body: {message: "Mon message"}} as Request, {sendStatus: (code: number) => undefined} as Response);

            //THEN
            expect(commandBus.dispatchedCommand).to.not.be.undefined;
            expect(commandBus.dispatchedCommand.type).to.be.equal(LAISSER_MESSAGE);
            // @ts-ignore
            expect(commandBus.dispatchedCommand.contenu).to.be.equal("Mon message");
        });

        it("doit renvoyer 200 si l'appel s'est correctement passé", function () {
            //GIVEN
            const commandBus: TestableCommandBus = new TestableCommandBus();
            const sut = new MessageController(commandBus, {} as QueryBus);

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
            const sut = new MessageController(commandBus, {} as QueryBus);

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
    describe("sur l'action recupererMessages", () => {
        it("doit dispatcher la query pour récupérer l'ensemble de messages", function () {
            //GIVEN
            const queryBus: TestableQueryBus = new TestableQueryBus();
            const sut = new MessageController({} as CommandBus, queryBus);

            //WHEN
            sut.recupererMessages({} as Request, {
                status: (code: number) => ({
                    send: () => undefined
                })
            } as Response);

            //THEN
            expect(queryBus.dispatchedQuery).to.not.be.undefined;
            expect(queryBus.dispatchedQuery.type).to.be.equal(RECUPERER_MESSAGES);
        });
        it("doit renvoyer la liste de messages quand l'opération s'est bien passée", function () {
            //GIVEN
            let messages = ["Message1", "Message2"];
            const queryBus: TestableQueryBus = new TestableQueryBus(false, messages);
            const sut = new MessageController({} as CommandBus, queryBus);

            //WHEN
            let messagesRécuperés;
            let statusEnvoyé;
            sut.recupererMessages({} as Request, {
                status: (status: number) => {
                    statusEnvoyé = status
                    return ({
                        send: (body: any) => {
                            messagesRécuperés = body;
                        }
                    });
                }
            } as Response);

            //THEN
            messagesRécuperés.forEach((messageRécupéré, i) => {
                expect(messageRécupéré).to.be.equal(messages[i]);
            })
            expect(queryBus.dispatchedQuery.type).to.be.equal(RECUPERER_MESSAGES);
            expect(statusEnvoyé).to.be.equal(200);
        });
        it("doit renvoyer code 200 l'opération s'est bien passée", function () {
            //GIVEN
            const queryBus: TestableQueryBus = new TestableQueryBus(false);
            const sut = new MessageController({} as CommandBus, queryBus);

            //WHEN
            let messagesRécuperés;
            let statusEnvoye;
            sut.recupererMessages({} as Request, {
                status: (status: number) => {
                    statusEnvoye = status
                    return ({
                        send: (body: any) => {
                            messagesRécuperés = body;
                        }
                    });
                }
            } as Response);

            //THEN

            expect(statusEnvoye).to.be.equal(200);
        });
        it("doit renvoyer code 500 l'opération est tombée en échec", function () {
            //GIVEN
            const queryBus: TestableQueryBus = new TestableQueryBus(true);
            const sut = new MessageController({} as CommandBus, queryBus);

            //WHEN
            let statusEnvoyé;
            sut.recupererMessages({} as Request, {
                status: (status: number) => {
                    statusEnvoyé = status
                    return ({
                        send: (body: any) => {
                        }
                    });
                }
            } as Response);

            //THEN

            expect(statusEnvoyé).to.be.equal(500);
        });
    })
})