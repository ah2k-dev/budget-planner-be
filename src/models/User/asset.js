const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assetSchema = new Schema({
  savings: {
    type: Number,
    default: 0,
  },
  account: {
    type: Number,
    default: 0,
  },
  cash: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Asset = mongoose.model("Asset", assetSchema);
module.exports = Asset;
