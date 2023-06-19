const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  asset: {
    type: String,
    enum: ["savings", "account", "cash"],
    required: true,
  },
  description: {
    type: String,
    default: "Miscellaneous"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
