const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
// We can add express rate limiter to login route to avoid unlimited login attempts
router.route("/").post(authControllers.login);

router.route("/refresh").get(authControllers.refresh);

router.route("/logout").post(authControllers.logout);

module.exports = router;
