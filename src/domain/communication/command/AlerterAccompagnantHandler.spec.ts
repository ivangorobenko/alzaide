import {expect} from "chai";
import {FakeUuidGenerator} from "../../../../test/FakeUuidGenerator";
import {InMemoryRepository} from "../../../infrastructure/repository/InMemoryRepository";
import {DummyMessagingService} from "../../../infrastructure/service/DummyMessagingService";
import {Alerte, Lieu} from "../agregat/Alerte";
import {AccompagnantAlerte} from "../event/AccompagnantAlerte";
import {InformationAccompagnant} from "../valueObject/InformationAccompagnant";
import {AlerterAccompagnant} from "./AlerterAccompagnant";
import {AlerterAccompagnantHandler} from "./AlerterAccompagnantHandler";

describe(`Commande d'alerte d'accompagnant`, function () {
    let alerteRepository: InMemoryRepository<Alerte>;
    let dummyMessagingService = new DummyMessagingService(false);
    const fakeUuidGenerator = new FakeUuidGenerator();
    const informationAccompagnantRepository = new InMemoryRepository<InformationAccompagnant>(fakeUuidGenerator);
    informationAccompagnantRepository.save({telephone: "0611964293"});

    beforeEach(() => {
        alerteRepository = new InMemoryRepository(fakeUuidGenerator);
    });

    it(`doit lancer une alerte et l'enregistrer`, function () {
        //GIVEN
        const sut = new AlerterAccompagnantHandler(
            dummyMessagingService,
            informationAccompagnantRepository,
            alerteRepository,
            fakeUuidGenerator
        );
        const lieu = new Lieu(1, 2);
        const timestamp = 123;
        const command = new AlerterAccompagnant(lieu, timestamp);

        //WHEN
        sut.handle(command);

        //THEN
        const alerts = alerteRepository.getAll();
        expect(alerts.length).to.equal(1);
        expect(alerts[0]).to.deep.equal(Alerte.lancer(fakeUuidGenerator.generate(), lieu, timestamp));
    });

    it(`doit envoyer un sms d'alerte à l'accompagnant`, function () {
        //GIVEN
        const sut = new AlerterAccompagnantHandler(
            dummyMessagingService,
            informationAccompagnantRepository,
            alerteRepository,
            fakeUuidGenerator
        );
        const command = new AlerterAccompagnant(new Lieu(1, 2), 123);

        //WHEN
        sut.handle(command);

        //THEN
        expect(dummyMessagingService.message).to.equal("Alerte !!!");
        expect(dummyMessagingService.telephone).to.equal("0611964293");
    });
    it(`doit retourner un événement que l'alerte a été lancée`, function () {
        //GIVEN
        const sut = new AlerterAccompagnantHandler(
            dummyMessagingService,
            informationAccompagnantRepository,
            alerteRepository,
            fakeUuidGenerator
        );
        const command = new AlerterAccompagnant(new Lieu(1, 2), 123);

        //WHEN
        const result = sut.handle(command);

        //THEN
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.be.deep.equal(new AccompagnantAlerte("myId"));
        expect(dummyMessagingService.telephone).to.equal("0611964293");
    });
    it(`doit retourner un erreur si l'alerte n'a pas pu être envoyer`, function () {
        //GIVEN
        dummyMessagingService = new DummyMessagingService(true);
        const sut = new AlerterAccompagnantHandler(
            dummyMessagingService,
            informationAccompagnantRepository,
            alerteRepository,
            fakeUuidGenerator
        );
        const command = new AlerterAccompagnant(new Lieu(1, 2), 123);

        //WHEN
        const result = sut.handle(command);

        //THEN
        expect(result.isFailure).to.be.true;
        expect(result.getValue()).to.be.deep.equal("Alerte n'a pas pu être envoyée");
    });
});
