import {expect} from "chai";
import {Command} from "./Command";
import {CommandBus} from "./CommandBus";
import {Event} from "./Event";
import {Result} from "./Result";

class MyCommand extends Command {
    constructor(readonly champ1: string) {
        super("MA_COMMANDE");
    }
}

class MyEvent extends Event {
    constructor() {
        super("id");
    }
}

describe("Le bus de commande", function () {
    it("doit permettre de souscrire une type de commande à un handler et de la dispatcher", function () {
        //GIVEN
        const sut = new CommandBus();
        let called = false;
        let calledCommand = undefined;

        //WHEN
        sut.subscribe("MA_COMMANDE", {
            handle: (command: Command) => {
                called = true;
                calledCommand = command;
                return Result.ok(new MyEvent());
            },
        });

        sut.dispatch(new MyCommand("Une valeur"));
        expect(called).to.be.true;
        expect(calledCommand).to.deep.equal(new MyCommand("Une valeur"));
    });

    it("doit renvoyer un erreur si le résultat de la commande dispatché est un erreur", function () {
        //GIVEN
        const sut = new CommandBus();

        //WHEN
        sut.subscribe("MA_COMMANDE", {
            handle: () => Result.fail<string>("Something went bad"),
        });
        const resultOrError = sut.dispatch(new MyCommand("Une valeur"));

        expect(resultOrError.isFailure).to.be.true;
    });

    it("doit renvoyer un événement si le résultat de la commande dispatché est un succès", function () {
        //GIVEN
        const sut = new CommandBus();

        //WHEN
        const expectedEvent = new MyEvent();
        sut.subscribe("MA_COMMANDE", {
            handle: () => Result.ok<Event>(expectedEvent),
        });
        const resultOrError = sut.dispatch(new MyCommand("Une valeur"));

        expect(resultOrError.getValue()).to.be.deep.equal(expectedEvent);
    });
});
