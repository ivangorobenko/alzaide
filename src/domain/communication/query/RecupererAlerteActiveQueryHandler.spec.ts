import {expect} from "chai";
import {InMemoryAlerteRepository} from "../../../infrastructure/repository/inMemory/InMemoryAlerteRepository";
import {UuidGenerator} from "../../../infrastructure/repository/UuidGenerator";
import {Alerte} from "../agregat/Alerte";
import {Lieu} from "../valueObject/Lieu";
import {RecupererAlerteLancee, RecupererAlerteLanceeQueryHandler} from "./RecupererAlerteLanceeQueryHandler";

describe("Query de l'alerte active", () => {
    const fakeUuidGenerator = new UuidGenerator();
    it("doit récupérer l'alerte active", function () {
        //GIVEN
        const alerteRepository = new InMemoryAlerteRepository(fakeUuidGenerator);
        const ancienneAlerte: Alerte = Alerte.lancer("uniqueAlerteId", new Lieu(43.604663, 1.44511), 123);
        const alerteActive: Alerte = Alerte.lancer("uniqueAlerteId2", new Lieu(13.604663, 2.44511), 222);

        alerteRepository.save(ancienneAlerte.arreter());
        alerteRepository.save(alerteActive);
        const alerteActiveQueryHandler = new RecupererAlerteLanceeQueryHandler(alerteRepository);
        //WHEN
        const resultOrError = alerteActiveQueryHandler.handle(new RecupererAlerteLancee());

        //THEN
        expect(resultOrError.isFailure).to.be.false;
        const alerte = resultOrError.getValue();
        expect(alerte).to.deep.equal(alerteActive);
    });
    it("doit renvoyer undefined s'il n'y a pas d'alertes actives", function () {
        //GIVEN
        const alerteRepository = new InMemoryAlerteRepository(fakeUuidGenerator);
        const alerte: Alerte = Alerte.lancer("uniqueAlerteId", new Lieu(43.604663, 1.44511), 123);
        alerteRepository.save(alerte.arreter());
        const alerteActiveQueryHandler = new RecupererAlerteLanceeQueryHandler(alerteRepository);
        //WHEN
        const resultOrError = alerteActiveQueryHandler.handle(new RecupererAlerteLancee());

        //THEN
        expect(resultOrError.isFailure).to.be.true;
        expect(resultOrError.getValue()).to.equal("Aucune alerte active");
    });
});
