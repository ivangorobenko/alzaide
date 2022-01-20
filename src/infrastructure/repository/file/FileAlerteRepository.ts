import {AlerteDataMapper} from "../../../application/mapper/AlerteDataMapper";
import {Alerte} from "../../../domain/communication/agregat/Alerte";
import {AlerteRepository} from "../../../domain/communication/repository/AlerteRepository";
import {IdGenerator} from "../../../domain/communication/repository/IdGenerator";
import {AlerteDB} from "../collection/AlerteDB";
import {readFile, syncPersistence} from "./file";

export class FileAlerteRepository implements AlerteRepository {
    private readonly filePath: string;
    protected readonly data: {[name: string]: AlerteDB};
    protected idGenerator: IdGenerator;

    constructor(path: string, idGenerator: any) {
        this.idGenerator = idGenerator;
        this.filePath = path;
        this.data = readFile(path) || {};
    }

    async save(value: Alerte): Promise<void> {
        const alerteExistante = Object.entries(this.data).find(([, item]) => item.id === value.id);
        if (alerteExistante === undefined) {
            this.data[this.idGenerator.generate()] = AlerteDataMapper.mapFromDomainToDB(value);
        } else {
            this.data[alerteExistante[0]] = AlerteDataMapper.mapFromDomainToDB(value);
        }
        return syncPersistence(this.filePath, this.data);
    }

    recupererAlerteLancee(): Alerte | undefined {
        const alerteDBTrouvee = Object.values(this.data).find(alerte =>
            alerte.lancee ? Alerte.create(alerte.id, alerte.lieu, alerte.timestamp, alerte.lancee) : undefined
        );
        if (alerteDBTrouvee) return AlerteDataMapper.mapFromDBToDomain(alerteDBTrouvee) as Alerte;
        return undefined;
    }
}
