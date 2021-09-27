// @ts-ignore
import chai, {expect} from "chai";
// @ts-ignore
import chaiHttp from "chai-http";
import {buildApp} from "../../../../src/buildApp";
import exp = require("constants");

chai.should();
chai.use(chaiHttp);

describe("La configuration de routes", () => {
    it("doit rendre accessible la route PUT /message", function () {
        chai.request(buildApp())
            .put("/message")
            .send({message: "mon message"})
            .end((err, res) => {
                expect(res.status).to.be.equal(204);
            });
    });
    it("doit rendre accessible la route GET /messages", function () {
        chai.request(buildApp())
            .get("/messages")
            .end((err, res) => {
                expect(res.status).to.be.equal(200);
            });
    });
});
