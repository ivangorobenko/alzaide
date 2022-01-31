import {expect} from "chai";
import {InMemoryTacheQuotidienneRepository} from "../../../infrastructure/repository/inMemory/InMemoryTacheQuotidienneRepository";
import {TacheQuotidienne} from "../agregat/TacheQuotidienne";
import {
    RecupererTachesQuotidiennes,
    RecupererTachesQuotidiennesQueryHandler,
} from "./RecupererTachesQuotidiennesQueryHandler";

describe("La requête pour recupérer les tâches quotidiennes", function () {
    it("doit recupérer l'ensemble de tâches quotidiennes de l'accompagné", function () {
        //GIVEN
        const tachesQuotidiennesRepository = new InMemoryTacheQuotidienneRepository();
        tachesQuotidiennesRepository.save("RECEVOIR_JOURNAL", TacheQuotidienne.create("RECEVOIR_JOURNAL", 1));
        tachesQuotidiennesRepository.save("PRENDRE_MEDICAMENTS", TacheQuotidienne.create("PRENDRE_MEDICAMENTS", 2));
        const recupererTachesQuotidiennesQueryHandler = new RecupererTachesQuotidiennesQueryHandler(
            tachesQuotidiennesRepository
        );

        //WHEN
        const result = recupererTachesQuotidiennesQueryHandler.handle(new RecupererTachesQuotidiennes());

        //
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal([
            {
                type: "RECEVOIR_JOURNAL",
                valide: false,
                timestampMiseAJour: 1,
            },
            {type: "PRENDRE_MEDICAMENTS", valide: false, timestampMiseAJour: 2},
        ]);
    });
    it("doit renvoyer une liste videsi aucune tâche n'a été trouvée", function () {
        //GIVEN
        const tachesQuotidiennesRepository = new InMemoryTacheQuotidienneRepository();
        const recupererTachesQuotidiennesQueryHandler = new RecupererTachesQuotidiennesQueryHandler(
            tachesQuotidiennesRepository
        );

        //WHEN
        const result = recupererTachesQuotidiennesQueryHandler.handle(new RecupererTachesQuotidiennes());

        //
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal([]);
    });
});
