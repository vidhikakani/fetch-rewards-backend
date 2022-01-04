const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    payer: { type: String },
    points: { type: Number },
    timestamp: { type: Date, default: Date.now },
});

const TransactionModel = mongoose.model("transaction", transactionSchema);

module.exports = TransactionModel;
