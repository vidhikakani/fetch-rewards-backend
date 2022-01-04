var express = require("express");

class Router {
    constructor(fetchController) {
        this.fetchController = fetchController;

        this.router = express.Router();

        this.router.post("/add-transaction", (req, res, next) => {
            this.fetchController.addTransaction(
                req.body.payer,
                req.body.points,
                req.body.timestamp,
                res,
                next
            );
        });

        this.router.post("/spend-points", (req, res) => {
            this.fetchController.spendPoints(req.body.points, res);
        });

        this.router.get("/get-balances", (req, res) => {
            this.fetchController.getBalances(res);
        });

        this.router.delete("/clear", (req, res) => {
            this.fetchController.clearCollection(res);
        });
    }
}

module.exports = Router;
