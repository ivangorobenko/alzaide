import {Result} from "../../core/Result";

export class Message {
    get timestamp(): number {
        return this._timestamp;
    }

    get id(): string {
        return this._id;
    }

    get contenu(): string {
        return this._contenu;
    }

    private readonly _contenu: string;
    private readonly _id: string;
    private readonly _timestamp: number;

    private constructor(id: string, contenu: string, timestamp: number) {
        this._id = id;
        this._contenu = contenu;
        this._timestamp = timestamp;
    }

    public static create(id: string, contenu: string, timestamp: number): Result<Message | string> {
        const hasMissingValue = (value: any) => !value;
        const findAParameterWithError = (parameters: any) => {
            const parameterWithError = Object.entries(parameters).find(([, value]) => hasMissingValue(value));
            return parameterWithError ? parameterWithError[0] : undefined;
        };
        const parameterNameWithError = findAParameterWithError({id, contenu, timestamp});

        return parameterNameWithError
            ? Result.fail(`${parameterNameWithError} du message ne peut pas être vide`)
            : Result.ok(new Message(id, contenu, timestamp));
    }
}
