import {Command} from "../../src/core/Command";
import {expect} from "chai";
import {CommandBus} from "../../src/core/CommandBus";
import {Result} from "../../src/core/Result";
import {Event} from "../../src/core/Event";


class MyCommand extends Command {
    constructor(readonly champ1: string) {
        super("MA_COMMANDE");
    }
}

class MyEvent extends Event {
    constructor() {
        super("id")
    }
}


describe('Le bus de commande', function () {
    it('doit permettre de souscrire une type de commande à un handler et de la dispatcher', function () {
        //GIVEN
        const sut = new CommandBus();
        let called = false;
        let calledCommand = undefined;

        //WHEN
        sut.subscribe("MA_COMMANDE", {
            handle: (command: Command) => {
                called = true
                calledCommand = command;
                return Result.ok(new MyEvent())
            }
        });

        sut.dispatch(new MyCommand("Une valeur"));
        expect(called).to.be.true;
        expect(calledCommand.type).to.be.equal("MA_COMMANDE");
        expect(calledCommand.champ1).to.be.equal("Une valeur");
    });
    it('doit renvoyer un erreur si le résultat de la commande dispatché est un erreur', function () {
        //GIVEN
        const sut = new CommandBus();

        //WHEN
        sut.subscribe("MA_COMMANDE", {
            handle: () => {
                return Result.fail("Something went bad")
            }
        });
        const resultOrError = sut.dispatch(new MyCommand("Une valeur"));


        expect(resultOrError.isFailure).to.be.true;
    });

    it("doit renvoyer id de la ressource impactée par la commande", function () {
        //GIVEN
        const sut = new CommandBus();

        //WHEN
        sut.subscribe("MA_COMMANDE", {
            handle: () => {
                return Result.ok(new MyEvent())
            }
        });
        const resultOrError = sut.dispatch(new MyCommand("Une valeur"));


        expect(resultOrError.getValue()).to.be.equal("id");

    });
});