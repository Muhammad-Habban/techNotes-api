const express = require("express");
const router = express.Router();
const noteControllers = require("../controllers/noteControllers");
const verifyJwt = require("../middleware/verifyJwt");
router.use(verifyJwt);
router
  .route("/")
  .get(noteControllers.getAllNotes)
  .post(noteControllers.createNewNote)
  .patch(noteControllers.updateNote)
  .delete(noteControllers.deleteNote);

module.exports = router;
