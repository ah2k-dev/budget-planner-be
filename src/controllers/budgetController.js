const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Budget = require("../models/Budget/budget");

const getBudget = async (req, res) => {
  // #swagger.tags = ['Budget']
  try {
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const createBudget = async (req, res) => {
  // #swagger.tags = ['Budget']
  try {
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const updateBudget = async (req, res) => {
  // #swagger.tags = ['Budget']
  try {
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const copyPreviousBudget = async (req, res) => {
  // #swagger.tags = ['Budget']
  try {
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
