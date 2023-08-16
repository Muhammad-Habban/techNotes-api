const express = require("express");
const router = express.Router();
const path = require("path");

// this expression is a regex (regular expression). So '^' this means at the beginning of the string only and '$' this means at the end of the string only '|' means OR and '(.something)?' means that it is optional
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
