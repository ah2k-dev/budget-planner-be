const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Budget = require("../models/Budget/budget");

const getBudget = async (req, res) => {
  // #swagger.tags = ['Budget']
  try {
    const monthFilter = req.body.month
      ? {
          month: moment(req.body.month).startOf("month"),
        }
      : { month: moment().startOf("month") };

    const budget = await Budget.aggregate([
      {
        $match: {
          user: req.user._id,
          ...monthFilter,
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "category",
          foreignField: "category",
          as: "transactions",
        },
      },
      {
        $unwind: {
          path: "$transactions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$category",
          category: { $first: "$category" },
          minimumAmount: { $first: "$minimumAmount" },
          maximumAmount: { $first: "$maximumAmount" },
          transactions: { $push: "$transactions" },
        },
      },
      {
        $project: {
          _id: 0,
          month: 1,
          category: 1,
          minimumAmount: 1,
          maximumAmount: 1,
          transactions: {
            $filter: {
              input: "$transactions",
              as: "transaction",
              cond: {
                $and: [
                  { $gte: ["$$transaction.date", moment().startOf("month")] },
                  { $lte: ["$$transaction.date", moment().endOf("month")] },
                ],
              },
            },
          },
        },
      },
    ]);

    return SuccessHandler(
      {
        budget,
        message: "Budget fetched successfully",
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const createBudget = async (req, res) => {
  // #swagger.tags = ['Budget']
  try {
    const { month, category, minimumAmount, maximumAmount } = req.body;
    const budget = new Budget({
      month: moment(month).startOf("month"),
      category,
      minimumAmount,
      maximumAmount,
      user: req.user._id,
    });
    await budget.save();
    return SuccessHandler(
      {
        budget,
        message: "Budget created successfully",
      },
      201,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const updateBudget = async (req, res) => {
  // #swagger.tags = ['Budget']
  try {
    const { id } = req.params;
    const { month, category, minimumAmount, maximumAmount } = req.body;
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      {
        month: moment(month).startOf("month"),
        category: category,
        minimumAmount: minimumAmount,
        maximumAmount: maximumAmount,
      },
      { new: true }
    );
    return SuccessHandler(
      {
        budget: updatedBudget,
        message: "Budget updated successfully",
      },
      201,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const copyPreviousBudget = async (req, res) => {
  // #swagger.tags = ['Budget']
  try {
    const { month } = req.body;
    const previousBudget = await Budget.find({
      user: req.user._id,
      month: moment(month).startOf("month"),
    });
    const newBudget = previousBudget.map((budget) => {
      return {
        month: moment().startOf("month"),
        category: budget.category,
        minimumAmount: budget.minimumAmount,
        maximumAmount: budget.maximumAmount,
        user: req.user._id,
      };
    });
    await Budget.insertMany(newBudget);
    return SuccessHandler(
      {
        message: "Budget copied successfully",
      },
      201,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const getBudgets = async (req, res) => {
  // #swagger.tags = ['Budget']
  try {
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  getBudget,
  createBudget,
  updateBudget,
  copyPreviousBudget,
  getBudgets,
};
