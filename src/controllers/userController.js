const User = require("../models/User/user");
const Asset = require("../models/User/asset");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");

const getUser = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    return SuccessHandler(
      {
        user: req.user,
        message: "User fetched successfully",
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const updateUser = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const { name, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    );
    return SuccessHandler(
      {
        user: updated,
        message: "User updated successfully",
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const getAssets = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const assets = await Asset.find({ user: req.user._id });
    return SuccessHandler(
      {
        assets,
        message: "Assets fetched successfully",
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const updateAssets = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const { savings, account, cash } = req.body;
    const updated = await Asset.findOneAndUpdate(
      { user: req.user._id },
      { savings, account, cash },
      { new: true }
    );
    return SuccessHandler(
      {
        assets: updated,
        message: "Assets updated successfully",
      },

      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const addAssets = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const { savings, account, cash } = req.body;
    const updated = await Asset.create({
      user: req.user._id,
      savings,
      account,
      cash,
    });
    return SuccessHandler({
      assets: updated,
      message: "Assets updated successfully",
    });
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  getUser,
  updateUser,
  getAssets,
  updateAssets,
  addAssets,
};
