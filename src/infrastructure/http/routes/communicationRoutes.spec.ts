// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import chai, {expect} from "chai";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import chaiHttp from "chai-http";
import {buildTest} from "../../../buildTest";
chai.should();
chai.use(chaiHttp);

describe("La configuration de routes de communication", () => {
    const testContext: any = {};
    beforeEach(() => {
        const {app, repositories} = buildTest();
        testContext.app = app;
        testContext.repositories = repositories;
    });
    describe("dans le contexte de messages", () => {
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
    });
    //FIXME: il y a un souci avec le contexte de tests en enlevant le describe de messages le test plante
    it("doit rendre accessible la route PUT /alerte", done => {
        const informationAccompagnantRepository = testContext.repositories.informationAccompagnantRepository;
        informationAccompagnantRepository.save({telephone: "0611964293"});
        chai.request(testContext.app)
            .put("/alerte")
            .send({alerte: {lieu: {latitude: 1.2, longitude: 2.3}, timestamp: 123}})
            .end((err, res) => {
                expect(res.status).to.be.equal(204);
                done();
            });
    });
});
