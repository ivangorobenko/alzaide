import chai, {expect} from "chai";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {TestableCommandBus} from "../../../test/TestableCommandBus";
import {TestableQueryBus} from "../../../test/TestableQueryBus";
import {CommandBus} from "../../core/CommandBus";
import {QueryBus} from "../../core/QueryBus";
import {Alerte} from "../../domain/communication/agregat/Alerte";
import {Message} from "../../domain/communication/agregat/Message";
import {
    ALERTER_ACCOMPAGNANT,
    AlerterAccompagnant,
} from "../../domain/communication/command/AlerterAccompagnantCommandHandler";
import {
    ARRETER_ALERTE_LANCEE,
    ArreterAlerteLancee,
} from "../../domain/communication/command/ArreterAlerteLanceeCommandHandler";
import {LAISSER_MESSAGE, LaisserMessage} from "../../domain/communication/command/LaisserMessageCommandHandler";
import {SUPPRIMER_MESSAGE, SupprimerMessage} from "../../domain/communication/command/SupprimerMessageCommandHandler";
import {
    RECUPERER_ALERTE_LANCEE,
    RecupererAlerteLancee,
} from "../../domain/communication/query/RecupererAlerteLanceeQueryHandler";
import {
    RECUPERER_MESSAGES,
    RecupererMessagesQuery,
} from "../../domain/communication/query/RecupererMessagesQueryHandler";
import {Lieu} from "../../domain/communication/valueObject/Lieu";
import {AlerteDTO} from "./AlerteDTO";
import {CommunicationController} from "./CommunicationController";
import {MessageDTO} from "./MessageDTO";

chai.should();

describe("CommunicationController", () => {
    describe("sur l'action laisserMessage", () => {
        it("doit dispatcher la commande pour laisser un message", function () {
            //GIVEN
            const commandBus: TestableCommandBus<LaisserMessage> = new TestableCommandBus();
            const sut = new CommunicationController(commandBus, {} as QueryBus);

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
            const sut = new CommunicationController(commandBus, {} as QueryBus);

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
            const sut = new CommunicationController(commandBus, {} as QueryBus);

            //WHEN
            let resultStatusCode = 0;
            const res = {
                sendStatus: (code: number) => {
                    resultStatusCode = code;
                },
            } as Response;
            sut.laisserMessage({body: {message: "Mon message"}} as Request, res);

            //THEN
            expect(resultStatusCode).to.be.equals(500);
        });
    });
    describe("sur l'action recupererMessages", () => {
        it("doit dispatcher la query pour récupérer l'ensemble de messages", function () {
            //GIVEN
            const messages = [Message.create("1", "Message 1", 123), Message.create("2", "Message 2", 123)];
            const queryBus: TestableQueryBus<RecupererMessagesQuery> = new TestableQueryBus(false, messages);
            const sut = new CommunicationController({} as CommandBus, queryBus);

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
        it("doit renvoyer 200 et la liste de messages quand l'opération s'est bien passée", function () {
            //GIVEN

            const message1 = Message.create("1", "Message 1", 123).getValue();
            const expectedMessageDTO1 = new MessageDTO("1", "Message 1", 123);
            const message2 = Message.create("2", "Message 2", 123).getValue();
            const expectedMessageDTO2 = new MessageDTO("2", "Message 2", 123);
            const queryBus: TestableQueryBus<RecupererMessagesQuery> = new TestableQueryBus(false, [
                message1,
                message2,
            ]);
            const sut = new CommunicationController({} as CommandBus, queryBus);

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
            const sut = new CommunicationController({} as CommandBus, queryBus);

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
            const sut = new CommunicationController(commandBus, {} as QueryBus);

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
            const sut = new CommunicationController(commandBus, {} as QueryBus);
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
        it("doit renvoyer Bad request si le traitement de la commande renvoie un échec", () => {
            //GIVEN
            const commandBus: TestableCommandBus<SupprimerMessage> = new TestableCommandBus(true);
            const sut = new CommunicationController(commandBus, {} as QueryBus);
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
    describe("sur l'action d'alerter l'accompagnant", () => {
        it("doit dispatcher la commande pour alerte l'accompagnant", function () {
            //GIVEN
            const commandBus: TestableCommandBus<AlerterAccompagnant> = new TestableCommandBus();
            const sut = new CommunicationController(commandBus, {} as QueryBus);

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
            const sut = new CommunicationController(commandBus, {} as QueryBus);

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
            const sut = new CommunicationController(commandBus, {} as QueryBus);

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
    describe("sur l'action de recuperer l'alerte lancee", () => {
        it("doit dispatcher la query pour de récupération de l'alerte active", function () {
            //GIVEN
            const queryBus = new TestableQueryBus<RecupererAlerteLancee>();
            const sut = new CommunicationController({} as CommandBus, queryBus);

            //WHEN
            sut.recupererAlerteLancee({} as Request, {status: () => ({send: () => ({})})} as any);

            //THEN
            const dispatchedQuery: RecupererAlerteLancee | undefined = queryBus.dispatchedQuery;
            expect(dispatchedQuery).to.not.be.undefined;
            expect(dispatchedQuery?.type).to.be.equal(RECUPERER_ALERTE_LANCEE);
        });

        it("doit renvoyer 200 et l'alerte dans la réponse si l'appel s'est correctement passé", function () {
            //GIVEN
            const alerteId = "id";
            const lieu = new Lieu(1.2, 3.2);
            const timestamp = 123;
            const alerte = Alerte.lancer(alerteId, lieu, timestamp);
            const expectedAlerteDTO = new AlerteDTO(alerteId, lieu, timestamp);
            const queryBus = new TestableQueryBus<RecupererAlerteLancee>(false, alerte);
            const sut = new CommunicationController({} as CommandBus, queryBus);

            //WHEN
            let statusEnvoye;
            let sendBody;
            sut.recupererAlerteLancee(
                {} as Request,
                {
                    status: (status: number) => {
                        statusEnvoye = status;
                        return {
                            send: (body: any) => {
                                sendBody = body;
                            },
                        };
                    },
                } as any
            );
            //THEN
            expect(statusEnvoye).to.equal(StatusCodes.OK);
            expect(sendBody).to.deep.equal(expectedAlerteDTO);
        });
    });
    describe("sur l'action d'arrêter l'alerte", () => {
        it("doit dispatcher la commande pour arrêter l'alerte", function () {
            //GIVEN
            const commandBus: TestableCommandBus<ArreterAlerteLancee> = new TestableCommandBus();
            const sut = new CommunicationController(commandBus, {} as QueryBus);

            //WHEN
            sut.arreterAlerteLancee({} as Request, {sendStatus: () => undefined} as any);

            //THEN
            const dispatchedCommand: ArreterAlerteLancee | undefined = commandBus.dispatchedCommand;
            expect(dispatchedCommand).to.not.be.undefined;
            expect(dispatchedCommand?.type).to.be.equal(ARRETER_ALERTE_LANCEE);
        });
        it("doit renvoyer 204 si tout s'est bien passé", () => {
            //GIVEN
            let responseCode = 0;
            const commandBus: TestableCommandBus<ArreterAlerteLancee> = new TestableCommandBus();
            const sut = new CommunicationController(commandBus, {} as QueryBus);

            //WHEN
            sut.arreterAlerteLancee(
                {} as Request,
                {
                    sendStatus: (status: number) => {
                        responseCode = status;
                    },
                } as any
            );

            expect(responseCode).to.equal(StatusCodes.NO_CONTENT);
        });
        it("doit renvoyer 500 si tout si l'opération a échoué", () => {
            //GIVEN
            let responseCode = 0;
            const commandBus: TestableCommandBus<ArreterAlerteLancee> = new TestableCommandBus(true);
            const sut = new CommunicationController(commandBus, {} as QueryBus);

            //WHEN
            sut.arreterAlerteLancee(
                {} as Request,
                {
                    sendStatus: (status: number) => {
                        responseCode = status;
                    },
                } as any
            );

            expect(responseCode).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    });
});
