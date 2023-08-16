const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
// dealing with CRUD operations related to Users page and these request take in a function, those function will be created in a seperate file and will be imported here
router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createNewUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
