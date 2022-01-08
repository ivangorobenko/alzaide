import {expect} from "chai";
import {InMemoryConfigRepository} from "../../../infrastructure/repository/InMemoryConfigRepository";
import {DummyMessagingService} from "../../../infrastructure/service/DummyMessagingService";
import {AccompagnantAlerte} from "../event/AccompagnantAlerte";
import {AlerterAccompagnant} from "./AlerterAccompagnant";
import {AlerterAccompagnantHandler} from "./AlerterAccompagnantHandler";

describe(`Commande d'alerte d'accompagnant`, function () {
    it(`doit envoyer un sms d'alerte à l'accompagnant`, function () {
        //GIVEN
        const dummyMessagingService = new DummyMessagingService(false);
        const configRepository = new InMemoryConfigRepository();
        configRepository.save("telephone", "0611964293");
        const sut = new AlerterAccompagnantHandler(dummyMessagingService, configRepository);
        const command = new AlerterAccompagnant();

        //WHEN
        sut.handle(command);

        //THEN
        expect(dummyMessagingService.message).to.equal("Alerte !!!");
        expect(dummyMessagingService.telephone).to.equal("0611964293");
    });
    it(`doit retourner un événement que l'alerte a été lancée`, function () {
        //GIVEN
        const dummyMessagingService = new DummyMessagingService(false);
        const configRepository = new InMemoryConfigRepository();
        configRepository.save("telephone", "0611964293");
        const sut = new AlerterAccompagnantHandler(dummyMessagingService, configRepository);
        const command = new AlerterAccompagnant();

        //WHEN
        const result = sut.handle(command);

        //THEN
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.be.deep.equal(new AccompagnantAlerte("12223344"));
        expect(dummyMessagingService.telephone).to.equal("0611964293");
    });
    it(`doit retourner un erreur si l'alerte n'a pas pu être envoyée`, function () {
        //GIVEN
        const dummyMessagingService = new DummyMessagingService(true);
        const configRepository = new InMemoryConfigRepository();
        configRepository.save("telephone", "0611964293");
        const sut = new AlerterAccompagnantHandler(dummyMessagingService, configRepository);
        const command = new AlerterAccompagnant();

        //WHEN
        const result = sut.handle(command);

        //THEN
        expect(result.isFailure).to.be.true;
        expect(result.getValue()).to.be.deep.equal("Alerte n'a pas pu être envoyée");
    });
});
