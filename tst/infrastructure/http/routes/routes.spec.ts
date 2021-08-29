// @ts-ignore
import chai,{expect} from "chai";
import {buildApp} from "../../../../src/buildApp";
// @ts-ignore
import chaiHttp from "chai-http";

chai.should();
chai.use(chaiHttp);

describe("La configuration de routes", () => {
    it('doit rendre accessible la route PUT /message', function () {
        chai.request(buildApp()).put("/message",).send({ message: 'mon message' }).end((err,res)=>{
            expect(res.status).to.be.equal(200)
        })
    });
    it.skip('doit rendre accessible la route GET /messages', function () {
        chai.request(buildApp()).get("/messages",).end((err,res)=>{
            expect(res.status).to.be.equal(200)
        })
    });
});