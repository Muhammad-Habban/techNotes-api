const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema({
  user: {
    // this basically tells mongoose that the type of this entry of Schema is of another Schema inside mongoose that we will later pass to it using 'ref'
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    // ref refers to the model created by the Schema of which type this document of specific schema is.
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "Employee",
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  start_seq: 500,
  id: "ticketNums",
});

module.exports = mongoose.model("Note", noteSchema);
