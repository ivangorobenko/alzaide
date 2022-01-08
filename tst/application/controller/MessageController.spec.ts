import chai, {expect} from "chai";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {MessageController} from "../../../src/application/controller/MessageController";
import {MessageDTO} from "../../../src/application/controller/MessageDTO";
import {CommandBus} from "../../../src/core/CommandBus";
import {QueryBus} from "../../../src/core/QueryBus";
import {Message} from "../../../src/domain/communication/agregat/Message";
import {LAISSER_MESSAGE, LaisserMessage} from "../../../src/domain/communication/command/LaisserMessageCommandHandler";
import {
    SUPPRIMER_MESSAGE,
    SupprimerMessage,
} from "../../../src/domain/communication/command/SupprimerMessageCommandHandler";
import {
    RECUPERER_MESSAGES,
    RecupererMessagesQuery,
} from "../../../src/domain/communication/query/RecupererMessagesQueryHandler";
import {TestableCommandBus} from "./TestableCommandBus";
import {TestableQueryBus} from "./TestableQueryBus";

chai.should();

describe("MessageController", () => {
    describe("sur l'action laisserMessage", () => {
        it("doit dispatcher la commande pour laisser un message", function () {
            //GIVEN
            const commandBus: TestableCommandBus<LaisserMessage> = new TestableCommandBus();
            const sut = new MessageController(commandBus, {} as QueryBus);

            //WHEN
            sut.laisserMessage({body: {message: "Mon message"}} as Request, {sendStatus: () => undefined} as any);

            //THEN
            const dispatchedCommand: LaisserMessage | undefined = commandBus.dispatchedCommand;
            expect(dispatchedCommand).to.not.be.undefined;
            expect(dispatchedCommand?.type).to.be.equal(LAISSER_MESSAGE);
            expect(dispatchedCommand?.message).to.be.equal("Mon message");
        });

        it("doit renvoyer 204 si l'appel s'est correctement passé", function () {
            //GIVEN
            const commandBus: TestableCommandBus<LaisserMessage> = new TestableCommandBus();
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
            const commandBus: TestableCommandBus<LaisserMessage> = new TestableCommandBus(true);
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
            const queryBus: TestableQueryBus<RecupererMessagesQuery> = new TestableQueryBus(false, messages);
            const sut = new MessageController({} as CommandBus, queryBus);

            //WHEN
            const dummyResponse = {
                status: () => ({
                    send: () => undefined,
                }),
            };
            sut.recupererMessages({} as Request, dummyResponse as any);

            //THEN
            const dispatchedQuery: RecupererMessagesQuery | undefined = queryBus.dispatchedQuery;
            expect(dispatchedQuery).to.not.be.undefined;
            expect(dispatchedQuery?.type).to.be.equal(RECUPERER_MESSAGES);
        });
        it("doit renvoyer le code http 200 et la liste de messages quand l'opération s'est bien passée", function () {
            //GIVEN

            const message1 = Message.create("1", "Message 1", 123).getValue();
            const expectedMessageDTO1 = new MessageDTO("1", "Message 1", 123);
            const message2 = Message.create("2", "Message 2", 123).getValue();
            const expectedMessageDTO2 = new MessageDTO("2", "Message 2", 123);
            const queryBus: TestableQueryBus<RecupererMessagesQuery> = new TestableQueryBus(false, [
                message1,
                message2,
            ]);
            const sut = new MessageController({} as CommandBus, queryBus);

            //WHEN
            let messagesRecuperes: Message[] = [];
            let statusEnvoye;
            sut.recupererMessages(
                {} as Request,
                {
                    status: (status: number) => {
                        statusEnvoye = status;
                        return {
                            send: (body: any) => {
                                messagesRecuperes = body;
                            },
                        };
                    },
                } as any
            );

            //THEN
            expect(messagesRecuperes[0]).to.be.deep.equal(expectedMessageDTO1);
            expect(messagesRecuperes[1]).to.be.deep.equal(expectedMessageDTO2);
            expect(statusEnvoye).to.be.equal(200);
        });

        it("doit renvoyer code 500 l'opération est tombée en échec", function () {
            //GIVEN
            const queryBus: TestableQueryBus<RecupererMessagesQuery> = new TestableQueryBus(true);
            const sut = new MessageController({} as CommandBus, queryBus);

            //WHEN
            let statusEnvoye;
            sut.recupererMessages(
                {} as Request,
                {
                    sendStatus: (status: number) => {
                        statusEnvoye = status;
                    },
                } as Response
            );

            //THEN

            expect(statusEnvoye).to.be.equal(500);
        });
    });
    describe("sur l'action supprimerMessage", function () {
        it("doit dispatcher la commande SupprimerMessage", () => {
            //GIVEN
            const commandBus: TestableCommandBus<SupprimerMessage> = new TestableCommandBus();
            const sut = new MessageController(commandBus, {} as QueryBus);

            //WHEN
            sut.supprimerMessage({params: {id: "1"}} as any, {sendStatus: () => undefined} as any);

            //THEN
            const dispatchedCommand: SupprimerMessage | undefined = commandBus.dispatchedCommand;
            expect(dispatchedCommand).to.not.be.undefined;
            expect(dispatchedCommand?.type).to.be.equal(SUPPRIMER_MESSAGE);
            expect(dispatchedCommand?.id).to.be.equal("1");
        });
        it("doit renvoyer 204 si la suppression s'est correctement déroulée", () => {
            //GIVEN
            const commandBus: TestableCommandBus<SupprimerMessage> = new TestableCommandBus();
            const sut = new MessageController(commandBus, {} as QueryBus);
            let responseCode;

            //WHEN
            sut.supprimerMessage(
                {params: {id: "1"}} as any,
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
        const commandBus: TestableCommandBus<SupprimerMessage> = new TestableCommandBus(true);
        const sut = new MessageController(commandBus, {} as QueryBus);
        let responseCode;

        //WHEN
        sut.supprimerMessage(
            {params: {id: "1"}} as any,
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
