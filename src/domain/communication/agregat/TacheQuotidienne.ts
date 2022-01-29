export class TacheQuotidienne {
    type: string;
    valide: boolean;
    timestampMiseAJour: number;

    constructor(type: string, valide: boolean, timestampMiseAJour: number) {
        this.type = type;
        this.valide = valide;
        this.timestampMiseAJour = timestampMiseAJour;
    }

    public static valider(tache: TacheQuotidienne, timestampMiseAJour: number): TacheQuotidienne {
        return new TacheQuotidienne(tache.type, true, timestampMiseAJour);
    }
}
