const transactionModel = require("../models/transactionModel");

class FetchController {
    constructor() {}

    addTransaction(payer, points, timestamp, res, next) {
        if (timestamp === undefined) {
            return res.status(400).send("Timestamp is undefined");
        } else if (payer === undefined) {
            return res.status(400).send("Payer is undefined");
        } else if (points === undefined) {
            return res.status(400).send("Points are undefined");
        } else {
            transactionModel
                .create({
                    payer: payer,
                    points: points,
                    timestamp: timestamp,
                })
                .then(() =>
                    res.send(
                        `Created transaction for ${payer} with ${points} Points`
                    )
                )
                .catch((err) => console.log(err));
        }
    }

    spendPoints(points, res, next) {
        transactionModel
            .find()
            .then((data) => {
                let pointTotal = data.reduce(
                    (acc, curr) => acc + curr.points,
                    0
                );

                if (pointTotal < points) {
                    res.status(500).json({ err: "Insufficient points" });
                } else {
                    transactionModel
                        .find({})
                        .sort({ timestamp: "asc" })
                        .then((data) => {
                            let returnData = {};
                            let pointsToSpend = points;
                            for (let i = 0; i < data.length; i++) {
                                if (pointsToSpend <= 0) {
                                    break;
                                }
                                if (data[i].points > 0) {
                                    if (pointsToSpend - data[i].points >= 0) {
                                        returnData[data[i].payer] =
                                            -1 * data[i].points;
                                        pointsToSpend =
                                            pointsToSpend - data[i].points;
                                        transactionModel
                                            .findByIdAndUpdate(data[i]._id, {
                                                points: 0,
                                            })
                                            .catch((err) => console.log(err));
                                    } else {
                                        let remainingPayerPoints =
                                            data[i].points - pointsToSpend;
                                        returnData[data[i].payer] =
                                            -1 * pointsToSpend;
                                        pointsToSpend = 0;
                                        transactionModel
                                            .findByIdAndUpdate(data[i]._id, {
                                                points: remainingPayerPoints,
                                            })
                                            .catch((err) => console.log(err));
                                    }
                                } else {
                                    pointsToSpend =
                                        pointsToSpend - data[i].points;
                                    returnData[data[i].payer] -= data[i].points;

                                    transactionModel
                                        .findByIdAndUpdate(data[i]._id, {
                                            points: 0,
                                        })
                                        .catch((err) => console.log(err));
                                }
                            }
                            const response = Object.keys(returnData).map(
                                (key) => ({
                                    payer: key,
                                    points: returnData[key],
                                })
                            );
                            res.send(response);
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    }

    getBalances(res, next) {
        transactionModel
            .find({}, "payer points")
            .then((data) => {
                let returnData = {};
                for (let i = 0; i < data.length; i++) {
                    if (returnData[data[i].payer]) {
                        returnData[data[i].payer] += data[i].points;
                    } else {
                        returnData[data[i].payer] = data[i].points;
                    }
                }
                res.json(returnData);
            })
            .catch((err) => console.log(err));
    }

    clearCollection(res) {
        transactionModel
            .deleteMany({})
            .then(() => res.send("Dropped collection"))
            .catch((err) => console.log(err));
    }
}

module.exports = FetchController;
