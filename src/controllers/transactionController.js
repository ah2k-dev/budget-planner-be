const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Transaction = require("../models/Budget/transaction");
const Budget = require("../models/Budget/budget");
const Asset = require("../models/User/asset");
const moment = require("moment");

const getTransactions = async (req, res, next) => {
  // #swagger.tags = ['Transaction']
  try {
    const dateFilter =
      req.body.start && req.body.end
        ? { date: { $gte: req.body.start, $lte: req.body.end } }
        : {
            date: {
              $gte: moment().startOf("month"),
              $lte: moment().endOf("month"),
            },
          };
    const categoryFilter = req.body.category
      ? { category: req.body.category }
      : {};
    const typeFilter = req.body.type ? { type: req.body.type } : {};
    const assetFilter = req.body.asset ? { asset: req.body.asset } : {};
    const searchFilter = req.body.search ? { search: req.body.search } : {};
    const transactions = await Transaction.find({
      user: req.user._id,
      ...dateFilter,
      ...categoryFilter,
      ...typeFilter,
      ...assetFilter,
      ...searchFilter,
    }).populate("category");
    return SuccessHandler(
      {
        transactions,
        message: "Transactions fetched successfully",
      },
      200,
      res
    );
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

// const updateTransaction = async (req, res, next) => {
//   // #swagger.tags = ['Transaction']
//   try {
//     const { id } = req.params;
//     const { amount, category, type, asset, description } = req.body;
//     const exTransaction = await Transaction.findById(id);
//     if (!exTransaction) {
//       return ErrorHandler("Transaction not found", 404, req, res);
//     }
//     const assets = await Asset.findOne({ user: req.user._id });
//     if (type == exTransaction.type) {
//       // if same type
//       if (amount == exTransaction.amount) {
//         // if same amount
//         if (asset == exTransaction.asset) {
//           // if same asset
//           await Transaction.findByIdAndUpdate(id, {
//             category,
//             description,
//           });
//           return SuccessHandler(
//             {
//               message: "Transaction updated successfully",
//             },
//             200,
//             res
//           );
//         } else {
//           // if different asset
//           if (type === "income") {
//             assets[asset] += amount;
//             assets[exTransaction.asset] -= amount;
//           } else {
//             assets[asset] -= amount;
//             assets[exTransaction.asset] += amount;
//           }
//           await assets.save();
//           await Transaction.findByIdAndUpdate(id, {
//             category,
//             description,
//             asset,
//           });
//           return SuccessHandler(
//             {
//               message: "Transaction updated successfully",
//             },
//             200,
//             res
//           );
//         }
//       } else {
//         // if different amount
//         if (asset == exTransaction.asset) {
//           // if same asset
//           if (type === "income") {
//             if (assets[asset] - exTransaction.amount < amount) {
//               return ErrorHandler("Insufficient funds", 400, req, res);
//             }
//             assets[asset] += amount;
//             assets[asset] -= exTransaction.amount;
//           } else {
//             if (assets[asset] + exTransaction.amount < amount) {
//               return ErrorHandler("Insufficient funds", 400, req, res);
//             }
//             assets[asset] -= amount;
//             assets[asset] += exTransaction.amount;
//           }
//           await assets.save();
//           await Transaction.findByIdAndUpdate(id, {
//             category,
//             description,
//             amount,
//           });
//           return SuccessHandler(
//             {
//               message: "Transaction updated successfully",
//             },
//             200,
//             res
//           );
//         } else {
//           // if different asset
//           if (type === "income") {
//             if (assets[asset] - exTransaction.amount < amount) {
//               return ErrorHandler("Insufficient funds", 400, req, res);
//             }
//             assets[asset] += amount;
//             assets[exTransaction.asset] -= amount;
//           } else {
//             if (assets[asset] + exTransaction.amount < amount) {
//               return ErrorHandler("Insufficient funds", 400, req, res);
//             }
//             assets[asset] -= amount;
//             assets[exTransaction.asset] += amount;
//           }
//           await assets.save();
//           await Transaction.findByIdAndUpdate(id, {
//             category,
//             description,
//             amount,
//             asset,
//           });
//           return SuccessHandler(
//             {
//               message: "Transaction updated successfully",
//             },
//             200,
//             res
//           );
//         }
//       }
//     } else {
//       // if different type
//       if (amount == exTransaction.amount) {
//         // if same amount
//         if (asset == exTransaction.asset) {
//           // if same asset
//           if (type == "income") {
//             assets[asset] = assets[asset] + amount + exTransaction.amount;
//           } else {
//             assets[asset] = assets[asset] - amount - exTransaction.amount;
//           }
//           await assets.save();
//           await Transaction.findByIdAndUpdate(id, {
//             category,
//             description,
//             type,
//           });
//           return SuccessHandler(
//             {
//               message: "Transaction updated successfully",
//             },
//             200,
//             res
//           );
//         } else {
//           // if different asset
//           if (type == "income") {
//             assets[asset] = assets[asset] + amount;
//             assets[exTransaction.asset] =
//               assets[exTransaction.asset] + exTransaction.amount;
//           } else {
//             assets[asset] = assets[asset] - amount;
//             assets[exTransaction.asset] =
//               assets[exTransaction.asset] - exTransaction.amount;
//           }
//           await assets.save();
//           await Transaction.findByIdAndUpdate(id, {
//             category,
//             description,
//             type,
//             asset,
//           });
//           return SuccessHandler(
//             {
//               message: "Transaction updated successfully",
//             },
//             200,
//             res
//           );
//         }
//       } else {
//         // if different amount
//         if (asset == exTransaction.asset) {
//           // if same asset
//           if (type == "income") {
//             if (assets[asset] - exTransaction.amount < amount) {
//               return ErrorHandler("Insufficient funds", 400, req, res);
//             }
//             assets[asset] += amount;
//             assets[asset] -= exTransaction.amount;
//           } else {
//             if (assets[asset] + exTransaction.amount < amount) {
//               return ErrorHandler("Insufficient funds", 400, req, res);
//             }
//             assets[asset] -= amount;
//             assets[asset] += exTransaction.amount;
//           }
//           await assets.save();
//           await Transaction.findByIdAndUpdate(id, {
//             category,
//             description,
//             amount,
//             type,
//           });
//           return SuccessHandler(
//             {
//               message: "Transaction updated successfully",
//             },
//             200,
//             res
//           );
//         } else {
//           // if different asset
//           if (type == "income") {
//             if (assets[asset] - exTransaction.amount < amount) {
//               return ErrorHandler("Insufficient funds", 400, req, res);
//             }
//             assets[asset] += amount;
//             assets[exTransaction.asset] += exTransaction.amount;
//           } else {
//             if (assets[asset] + exTransaction.amount < amount) {
//               return ErrorHandler("Insufficient funds", 400, req, res);
//             }
//             assets[asset] -= amount;
//             assets[exTransaction.asset] -= exTransaction.amount;
//           }
//           await assets.save();
//           await Transaction.findByIdAndUpdate(id, {
//             category,
//             description,
//             amount,
//             type,
//             asset,
//           });
//         }
//       }
//     }
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

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

    const updateAsset = async (asset, amount) => {
      if (type === "income") {
        assets[asset] += amount;
      } else {
        assets[asset] -= amount;
      }
      await assets.save();
    };

    const errorHandler = (message) => {
      return ErrorHandler(message, 400, req, res);
    };

    if (type === exTransaction.type && amount === exTransaction.amount) {
      if (asset === exTransaction.asset) {
        // Same type, amount, and asset
        await Transaction.findByIdAndUpdate(id, { category, description });
      } else {
        // Same type and amount, different asset
        const updateAmount = type === "income" ? amount : -amount;
        assets[asset] += updateAmount;
        assets[exTransaction.asset] -= updateAmount;
        await updateAsset(asset, updateAmount);
        await updateAsset(exTransaction.asset, -updateAmount);
        await Transaction.findByIdAndUpdate(id, {
          category,
          description,
          asset,
        });
      }
    } else {
      if (asset === exTransaction.asset) {
        // Same amount and asset, different type
        const updateAmount =
          type === "income"
            ? amount - exTransaction.amount
            : -amount + exTransaction.amount;
        if (
          (type === "income" &&
            assets[asset] - exTransaction.amount < amount) ||
          (type !== "income" && assets[asset] + exTransaction.amount < amount)
        ) {
          return errorHandler("Insufficient funds");
        }
        assets[asset] += updateAmount;
        await updateAsset(asset, updateAmount);
        await Transaction.findByIdAndUpdate(id, {
          category,
          description,
          type,
        });
      } else {
        // Different amount and asset
        const updateAmount =
          type === "income"
            ? amount - exTransaction.amount
            : -amount + exTransaction.amount;
        if (
          (type === "income" &&
            assets[asset] - exTransaction.amount < amount) ||
          (type !== "income" && assets[asset] + exTransaction.amount < amount)
        ) {
          return errorHandler("Insufficient funds");
        }
        assets[asset] += updateAmount;
        assets[exTransaction.asset] += exTransaction.amount;
        await updateAsset(asset, updateAmount);
        await updateAsset(exTransaction.asset, exTransaction.amount);
        await Transaction.findByIdAndUpdate(id, {
          category,
          description,
          amount,
          type,
          asset,
        });
      }
    }

    return SuccessHandler(
      { message: "Transaction updated successfully" },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
}; // refactored

const deleteTransaction = async (req, res, next) => {
  // #swagger.tags = ['Transaction']
  try {
    const { id } = req.params;
    const deleted = await Transaction.findByIdAndDelete(id);
    await Asset.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: {
          [deleted.asset]:
            deleted.type === "income" ? -deleted.amount : deleted.amount,
        },
      }
    );
    return SuccessHandler(
      {
        message: "Transaction deleted successfully",
      },
      200,
      res
    );
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
