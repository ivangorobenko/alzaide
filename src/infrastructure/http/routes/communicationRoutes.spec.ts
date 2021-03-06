// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import chai, {expect} from "chai";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import chaiHttp from "chai-http";
import {buildTest} from "../../../buildTest";
import {Alerte} from "../../../domain/communication/agregat/Alerte";
import {Lieu} from "../../../domain/communication/valueObject/Lieu";

chai.should();
chai.use(chaiHttp);

describe("La configuration de routes de communication", () => {
    const testContext: any = {};
    beforeEach(() => {
        const {app, repositories} = buildTest();
        testContext.app = app;
        testContext.repositories = repositories;
    });
    it("doit rendre accessible la route PUT /message", done => {
        chai.request(testContext.app)
            .put("/message")
            .send({message: "mon message"})
            .end((err, res) => {
                expect(res.status).to.not.equal(404);
                expect(res.status).to.be.equal(204);
                done();
            });
    });
    it("doit rendre accessible la route GET /messages", done => {
        chai.request(testContext.app)
            .get("/messages")
            .end((err, res) => {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
    it("doit rendre accessible la route DELETE /messages:id", done => {
        chai.request(testContext.app)
            .delete("/messages/1")
            .end((err, res) => {
                expect(res.status).to.be.equal(204);
                done();
            });
    });
    it("doit rendre accessible la route PUT /alerte", done => {
        chai.request(testContext.app)
            .put("/alerte")
            .send({alerte: {lieu: {latitude: 1.2, longitude: 2.3}, timestamp: 123}})
            .end((err, res) => {
                expect(res.status).to.be.equal(204);
                done();
            });
    });
    it("doit rendre accessible la route GET /alerte", done => {
        const alerteRepository = testContext.repositories.alerteRepository;
        alerteRepository.save(Alerte.lancer("123", new Lieu(1, 2), 123));
        chai.request(testContext.app)
            .get("/alerte")
            .end((err, res) => {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
    it("doit rendre accessible la route DELETE /alerte", done => {
        const alerteRepository = testContext.repositories.alerteRepository;
        alerteRepository.save(Alerte.lancer("123", new Lieu(1, 2), 123));
        chai.request(testContext.app)
            .delete("/alerte")
            .end((err, res) => {
                expect(res.status).to.be.equal(204);
                done();
            });
    });
});
