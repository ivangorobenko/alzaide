export abstract class Event {
    get id() {
        return this._id;
    }
    private readonly _id;
    protected constructor(id: string) {
        this._id = id;
    }
}
