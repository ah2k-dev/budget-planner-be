const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
    month: {
        type: Date,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
    minimumAmount: {
        type: Number,
        required: true,
    },
    maximumAmount: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Budget = mongoose.model("Budget", budgetSchema);
module.exports = Budget;