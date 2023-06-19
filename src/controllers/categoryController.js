const Category = require("../models/Budget/category");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");

const getCategories = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const categories = await Category.find({
      $or: [{ user: req.user._id }, { type: "default" }],
    });
    return SuccessHandler(
      {
        categories,
        message: "Categories fetched successfully",
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const defaultCategory = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const created = await Category.insertMany([
      { name: "Food", type: "default" },
      { name: "Transport", type: "default" },
      { name: "Shopping", type: "default" },
      { name: "Bills", type: "default" },
      { name: "Entertainment", type: "default" },
      { name: "Health", type: "default" },
      { name: "Travel", type: "default" },
      { name: "Education", type: "default" },
      { name: "Groceries", type: "default" },
      { name: "Other", type: "default" },
    ]);
    return SuccessHandler(
      {
        categories: created,
        message: "Default categories created successfully",
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const addCategory = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const { name } = req.body;
    const created = await Category.create({
      name,
      user: req.user._id,
      type: "user",
    });
    return SuccessHandler(
      {
        category: created,
        message: "Category created successfully",
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const deleteCategory = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    return SuccessHandler(
      {
        category: deleted,
        message: "Category deleted successfully",
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  getCategories,
  defaultCategory,
  addCategory,
  deleteCategory,
};
