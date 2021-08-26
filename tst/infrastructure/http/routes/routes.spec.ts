import chai,{expect} from "chai";
import {buildApp} from "../../../../src/buildApp";
import chaiHttp from "chai-http";

chai.should();
chai.use(chaiHttp);

describe("La configuration de routes", () => {
    it('doit rendre accessible la route PUT /message', function () {
        chai.request(buildApp()).put("/message",).send({ message: 'mon message' }).end((err,res)=>{
            expect(res.status).to.be.equal(200)
        })
    });
});