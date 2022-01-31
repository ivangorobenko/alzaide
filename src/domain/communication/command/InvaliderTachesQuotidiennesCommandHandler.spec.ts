import {expect} from "chai";
import {InMemoryTacheQuotidienneRepository} from "../../../infrastructure/repository/inMemory/InMemoryTacheQuotidienneRepository";
import {TacheQuotidienne} from "../agregat/TacheQuotidienne";
import {TacheQuotidienneInvalidee} from "../event/TacheQuotidienneInvalidee";
import {
    InvaliderTachesQuotidiennes,
    InvaliderTachesQuotidiennesCommandHandler,
} from "./InvaliderTachesQuotidiennesCommandHandler";
import {TacheQuotidienneRepository} from "./ValiderTacheQuotidienneCommandHandler";

describe("Invalider taches quotidiennes command", function () {
    it("doit invalider toutes les taches quotidiennes à minuit et renvoyer un événement", function () {
        //GIVEN
        const tachesQuotidiennesRepository: TacheQuotidienneRepository = new InMemoryTacheQuotidienneRepository();
        tachesQuotidiennesRepository.save(
            "RECEVOIR_JOURNAL",
            TacheQuotidienne.valider(TacheQuotidienne.create("RECEVOIR_JOURNAL", 1), 5)
        );
        tachesQuotidiennesRepository.save(
            "PRENDRE_MEDICAMENTS",
            TacheQuotidienne.valider(TacheQuotidienne.create("PRENDRE_MEDICAMENTS", 2), 6)
        );
        const invaliderTachesQuotidiennesCommandHandler = new InvaliderTachesQuotidiennesCommandHandler(
            tachesQuotidiennesRepository,
            {now: () => 7, isMidnight: () => true}
        );

        //WHEN
        const result = invaliderTachesQuotidiennesCommandHandler.handle(new InvaliderTachesQuotidiennes());

        //THEN
        tachesQuotidiennesRepository.getAll().map(tache => {
            expect(tache.valide).to.be.false;
            expect(tache.timestampMiseAJour).to.equal(7);
        });
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal([
            new TacheQuotidienneInvalidee("RECEVOIR_JOURNAL"),
            new TacheQuotidienneInvalidee("PRENDRE_MEDICAMENTS"),
        ]);
    });
    it("net doit pas invalider les taches quotidiennes s'il n'est pas minuit et doit renvoyer un failure", function () {
        //GIVEN
        const tachesQuotidiennesRepository: TacheQuotidienneRepository = new InMemoryTacheQuotidienneRepository();
        tachesQuotidiennesRepository.save(
            "RECEVOIR_JOURNAL",
            TacheQuotidienne.valider(TacheQuotidienne.create("RECEVOIR_JOURNAL", 1), 5)
        );
        tachesQuotidiennesRepository.save(
            "PRENDRE_MEDICAMENTS",
            TacheQuotidienne.valider(TacheQuotidienne.create("PRENDRE_MEDICAMENTS", 2), 6)
        );
        const invaliderTachesQuotidiennesCommandHandler = new InvaliderTachesQuotidiennesCommandHandler(
            tachesQuotidiennesRepository,
            {now: () => 7, isMidnight: () => false}
        );

        //WHEN
        const result = invaliderTachesQuotidiennesCommandHandler.handle(new InvaliderTachesQuotidiennes());

        //THEN
        tachesQuotidiennesRepository.getAll().map(tache => {
            expect(tache.valide).to.be.true;
        });
        expect(result.isFailure).to.be.true;
    });
});
