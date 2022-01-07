// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import chai, {expect} from "chai";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import chaiHttp from "chai-http";
import {buildApp} from "../../../../src/buildApp";

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
    it("doit rendre accessible la route DELETE /messages:id", function () {
        chai.request(buildApp())
            .delete("/messages/1")
            .end((err, res) => {
                expect(res.status).to.be.equal(204);
            });
    });
});
