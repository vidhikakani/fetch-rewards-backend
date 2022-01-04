const { expect } = require("chai");
const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");

const API = "http://localhost:5000/api";

chai.should();

chai.use(chaiHTTP);

describe("Transaction API", () => {
    describe("Clear API", () => {
        // Clear transactions
        it("Should DELETE all transactions", (done) => {
            chai.request(API)
                .delete("/clear")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    // POST add-transaction route
    describe("POST /add-transaction", () => {
        it("Should POST a new transaction", (done) => {
            const transaction = {
                payer: "DANNON",
                points: 300,
                timestamp: "2020-10-31T10:00:00Z",
            };
            const expected = "Created transaction for DANNON with 300 Points";
            chai.request(API)
                .post("/add-transaction")
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.text).to.be.equal(expected);
                    done();
                });
        });

        it("Should NOT POST a new transaction", (done) => {
            const transaction = {
                points: 300,
                timestamp: "2020-10-31T1000:00Z",
                extra: "extra",
            };
            const expected = "Payer is undefined";
            chai.request(API)
                .post("/add-transaction")
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(400);
                    expect(res.text).to.be.equal(expected);
                    done();
                });
        });
    });

    // GET balances route
    describe("GET /get-balances", () => {
        it("Should GET all the points by payer", (done) => {
            const points = { DANNON: 300 };
            chai.request(API)
                .get("/get-balances")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(res.body).to.deep.equal(points);
                    done();
                });
        });
    });

    // POST spend-points route
    describe("POST /spend-points", () => {
        it("Should spend points available", (done) => {
            const spend = { points: 200 };
            const response = [{ payer: "DANNON", points: -200 }];
            chai.request(API)
                .post("/spend-points")
                .send(spend)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    expect(res.body).to.deep.equal(response);
                    done();
                });
        });

        it("Should not spend unavailable points", (done) => {
            const spend = { points: 200 };
            const response = { err: "Insufficient points" };
            chai.request(API)
                .post("/spend-points")
                .send(spend)
                .end((err, res) => {
                    res.should.have.status(500);
                    expect(res.body).to.deep.equal(response);
                    done();
                });
        });
    });
});
