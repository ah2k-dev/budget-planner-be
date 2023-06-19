const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const category = require("../controllers/categoryController");

//get
router.route("/").get(isAuthenticated, category.getCategories);
router.route("/defaultCategory").get(isAuthenticated, category.defaultCategory);
//post
router.route("/").post(isAuthenticated, category.addCategory);
//delete
router.route("/:id").delete(isAuthenticated, category.deleteCategory);


module.exports = router;