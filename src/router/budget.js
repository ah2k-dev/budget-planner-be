const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const budget = require("../controllers/budgetController.js");


router.route("/get").post(isAuthenticated, budget.getBudget);
router.route("/create").post(isAuthenticated, budget.createBudget);
router.route("/update/:id").put(isAuthenticated, budget.updateBudget);
router.route("/copyPreviousBudget").post(isAuthenticated, budget.copyPreviousBudget);
router.route("/getBudgets").post(isAuthenticated, budget.getBudgets);


module.exports = router;