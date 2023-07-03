const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const transaction = require("../controllers/transactionController.js");

router.route('/get').post(isAuthenticated, transaction.getTransactions)
router.route('/create').post(isAuthenticated, transaction.createTransaction)
router.route('/update/:id').put(isAuthenticated, transaction.updateTransaction)
router.route('/delete/:id').delete(isAuthenticated, transaction.deleteTransaction)

module.exports = router;