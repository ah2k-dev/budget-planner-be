const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Transaction = require("../models/Budget/transaction");
const Budget = require("../models/Budget/budget");
const Asset = require("../models/User/asset");

const getTransactions = async (req, res, next) => {
  // #swagger.tags = ['Transaction']
  try {
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const createTransaction = async (req, res, next) => {
  // #swagger.tags = ['Transaction']
  try {
    const { amount, category, type, asset, description } = req.body;
    const assets = await Asset.findOne({ user: req.user._id });
    if (!assets) {
      return ErrorHandler("No assets found", 404, req, res);
    }
    if (assets[asset] < amount) {
      return ErrorHandler("Insufficient funds", 400, req, res);
    }
    const transaction = new Transaction({
      amount,
      category,
      type,
      asset,
      description,
      user: req.user._id,
    });
    await transaction.save();
    if (type === "income") {
      assets[asset] += amount;
    } else {
      assets[asset] -= amount;
    }
    await assets.save();
    return SuccessHandler(
      {
        transaction,
        assets,
        message: "Transaction created successfully",
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateTransaction = async (req, res, next) => {
  // #swagger.tags = ['Transaction']
  try {
    const { id } = req.params;
    const { amount, category, type, asset, description } = req.body;
    const exTransaction = await Transaction.findById(id);
    if (!exTransaction) {
      return ErrorHandler("Transaction not found", 404, req, res);
    }
    const assets = await Asset.findOne({ user: req.user._id });
    if (type == exTransaction.type) {
      // if same type
      if (amount == exTransaction.amount) {
        // if same amount
        if (asset == exTransaction.asset) {
          // if same asset
          await Transaction.findByIdAndUpdate(id, {
            category,
            description,
          });
          return SuccessHandler(
            {
              message: "Transaction updated successfully",
            },
            200,
            res
          );
        } else {
          // if different asset
          if (type === "income") {
            assets[asset] += amount;
            assets[exTransaction.asset] -= amount;
          } else {
            assets[asset] -= amount;
            assets[exTransaction.asset] += amount;
          }
          await assets.save();
          await Transaction.findByIdAndUpdate(id, {
            category,
            description,
            asset,
          });
          return SuccessHandler(
            {
              message: "Transaction updated successfully",
            },
            200,
            res
          );
        }
      } else {
        // if different amount
        if (asset == exTransaction.asset) {
          // if same asset
          if (type === "income") {
            if (assets[asset] - exTransaction.amount < amount) {
              return ErrorHandler("Insufficient funds", 400, req, res);
            }
            assets[asset] += amount;
            assets[asset] -= exTransaction.amount;
          } else {
            if (assets[asset] + exTransaction.amount < amount) {
              return ErrorHandler("Insufficient funds", 400, req, res);
            }
            assets[asset] -= amount;
            assets[asset] += exTransaction.amount;
          }
          await assets.save();
          await Transaction.findByIdAndUpdate(id, {
            category,
            description,
            amount,
          });
          return SuccessHandler(
            {
              message: "Transaction updated successfully",
            },
            200,
            res
          );
        } else {
          // if different asset
          if (type === "income") {
            if (assets[asset] - exTransaction.amount < amount) {
              return ErrorHandler("Insufficient funds", 400, req, res);
            }
            assets[asset] += amount;
            assets[exTransaction.asset] -= amount;
          } else {
            if (assets[asset] + exTransaction.amount < amount) {
              return ErrorHandler("Insufficient funds", 400, req, res);
            }
            assets[asset] -= amount;
            assets[exTransaction.asset] += amount;
          }
          await assets.save();
          await Transaction.findByIdAndUpdate(id, {
            category,
            description,
            amount,
            asset,
          });
          return SuccessHandler(
            {
              message: "Transaction updated successfully",
            },
            200,
            res
          );
        }
      }
    } else {
      // if different type
      if (amount == exTransaction.amount) {
        // if same amount
        if (asset == exTransaction.asset) {
          // if same asset
          if (type == "income") {
            assets[asset] = assets[asset] + amount + exTransaction.amount;
          } else {
            assets[asset] = assets[asset] - amount - exTransaction.amount;
          }
          await assets.save();
          await Transaction.findByIdAndUpdate(id, {
            category,
            description,
            type,
          });
          return SuccessHandler(
            {
              message: "Transaction updated successfully",
            },
            200,
            res
          );
        } else {
          // if different asset
          if (type == "income") {
            assets[asset] = assets[asset] + amount;
            assets[exTransaction.asset] =
              assets[exTransaction.asset] + exTransaction.amount;
          } else {
            assets[asset] = assets[asset] - amount;
            assets[exTransaction.asset] =
              assets[exTransaction.asset] - exTransaction.amount;
          }
          await assets.save();
          await Transaction.findByIdAndUpdate(id, {
            category,
            description,
            type,
            asset,
          });
          return SuccessHandler(
            {
              message: "Transaction updated successfully",
            },
            200,
            res
          );
        }
      } else {
        // if different amount
        if (asset == exTransaction.asset) {
          // if same asset
          if (type == "income") {
            if (assets[asset] - exTransaction.amount < amount) {
              return ErrorHandler("Insufficient funds", 400, req, res);
            }
            assets[asset] += amount;
            assets[asset] -= exTransaction.amount;
          } else {
            if (assets[asset] + exTransaction.amount < amount) {
              return ErrorHandler("Insufficient funds", 400, req, res);
            }
            assets[asset] -= amount;
            assets[asset] += exTransaction.amount;
          }
          await assets.save();
          await Transaction.findByIdAndUpdate(id, {
            category,
            description,
            amount,
            type,
          });
          return SuccessHandler(
            {
              message: "Transaction updated successfully",
            },
            200,
            res
          );
        } else {
          // if different asset
          if (type == "income") {
            if (assets[asset] - exTransaction.amount < amount) {
              return ErrorHandler("Insufficient funds", 400, req, res);
            }
            assets[asset] += amount;
            assets[exTransaction.asset] += exTransaction.amount;
          } else {
            if (assets[asset] + exTransaction.amount < amount) {
              return ErrorHandler("Insufficient funds", 400, req, res);
            }
            assets[asset] -= amount;
            assets[exTransaction.asset] -= exTransaction.amount;
          }
          await assets.save();
          await Transaction.findByIdAndUpdate(id, {
            category,
            description,
            amount,
            type,
            asset,
          });
        }
      }
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteTransaction = async (req, res, next) => {
  // #swagger.tags = ['Transaction']
  try {
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
