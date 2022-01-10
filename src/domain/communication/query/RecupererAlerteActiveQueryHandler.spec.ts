import {expect} from "chai";
import {InMemoryAlerteRepository} from "../../../infrastructure/repository/InMemoryAlerteRepository";
import {UuidGenerator} from "../../../infrastructure/repository/UuidGenerator";
import {Alerte} from "../agregat/Alerte";
import {Lieu} from "../valueObject/Lieu";
import {RecupererAlerteActiveQuery, RecupererAlerteActiveQueryHandler} from "./RecupererAlerteActiveQueryHandler";

describe("Query de l'alerte active", () => {
    const fakeUuidGenerator = new UuidGenerator();
    it("doit récupérer l'alerte active", function () {
        //GIVEN
        const alerteRepository = new InMemoryAlerteRepository(fakeUuidGenerator);
        const ancienneAlerte: Alerte = Alerte.lancer("uniqueAlerteId", new Lieu(43.604663, 1.44511), 123);
        ancienneAlerte.desactiver();
        const alerteActive: Alerte = Alerte.lancer("uniqueAlerteId2", new Lieu(13.604663, 2.44511), 222);

        alerteRepository.save(ancienneAlerte);
        alerteRepository.save(alerteActive);
        const alerteActiveQueryHandler = new RecupererAlerteActiveQueryHandler(alerteRepository);
        //WHEN
        const resultOrError = alerteActiveQueryHandler.handle(new RecupererAlerteActiveQuery());

        //THEN
        expect(resultOrError.isFailure).to.be.false;
        const alerte = resultOrError.getValue();
        expect(alerte).to.deep.equal(alerteActive);
    });
    it("doit renvoyer undefined s'il n'y a pas d'alertes actives", function () {
        //GIVEN
        const alerteRepository = new InMemoryAlerteRepository(fakeUuidGenerator);
        const ancienneAlerte: Alerte = Alerte.lancer("uniqueAlerteId", new Lieu(43.604663, 1.44511), 123);
        ancienneAlerte.desactiver();

        alerteRepository.save(ancienneAlerte);
        const alerteActiveQueryHandler = new RecupererAlerteActiveQueryHandler(alerteRepository);
        //WHEN
        const resultOrError = alerteActiveQueryHandler.handle(new RecupererAlerteActiveQuery());

        //THEN
        expect(resultOrError.isFailure).to.be.true;
        expect(resultOrError.getValue()).to.equal("Aucune alerte active");
    });
});
