export class TacheQuotidienne {
    type: string;
    valide: boolean;
    timestampMiseAJour: number;

    private constructor(type: string, valide: boolean, timestampMiseAJour: number) {
        this.type = type;
        this.valide = valide;
        this.timestampMiseAJour = timestampMiseAJour;
    }

    public static valider(tache: TacheQuotidienne, timestampMiseAJour: number): TacheQuotidienne {
        return new TacheQuotidienne(tache.type, true, timestampMiseAJour);
    }

    public static create(typeTache: string, timestampMiseAJour: number): TacheQuotidienne {
        return new TacheQuotidienne(typeTache, false, timestampMiseAJour);
    }

    static invalider(tache: TacheQuotidienne, timestampMiseAJour: number) {
        return new TacheQuotidienne(tache.type, false, timestampMiseAJour);
    }
}
