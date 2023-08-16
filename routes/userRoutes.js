const express = require("express");
const router = express.Router();

// dealing with CRUD operations related to Users page and these request take in a function, those function will be created in a seperate file and will be imported here
router.route("/").get().post().patch().delete();

module.exports = router;
