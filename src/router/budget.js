const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const budget = require("../controllers/budgetController");


router.route("/get").get(isAuthenticated, budget.getBudget);
router.route("/create").post(isAuthenticated, budget.createBudget);
router.route("/update").put(isAuthenticated, budget.updateBudget);
router.route("/copyPreviousBudget").post(isAuthenticated, budget.copyPreviousBudget);
router.route("/getBudgets").post(isAuthenticated, budget.getBudgets);


module.exports = router;