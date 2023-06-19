const auth = require("./auth");
const user = require("./user");
const category = require("./category");
const router = require("express").Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/category", category);

module.exports = router;
