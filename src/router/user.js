const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const user = require("../controllers/userController.js");

//get
router.route("/").get(isAuthenticated, user.getUser);
router.route("/assets").get(isAuthenticated, user.getAssets);

//post
router.route("/assets").post(isAuthenticated, user.addAssets);

//put
router.route("/update").put(isAuthenticated, user.updateUser);
router.route("/updateAssets").put(isAuthenticated, user.updateAssets);


module.exports = router;