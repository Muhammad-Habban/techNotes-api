const asyncHandler = require("express-async-handler");
const Note = require("../models/Note");
const User = require("../models/Users");
const { default: mongoose } = require("mongoose");
const { ObjectID } = require("bson");
const { ObjectId } = require("bson");
const { truncate } = require("fs/promises");

// GET all notes
// GET /notes
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes?.length) {
    return res.status(400).json({ message: "No NOTES Found" });
  }
  res.json(notes);
});

//Create New Note
// POST /notes
const createNewNote = asyncHandler(async (req, res) => {
  const { title, text, username } = req.body;
  if (!title || !text || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userFound = await User.findOne({ username }).exec();
  if (!userFound) {
    return res
      .status(400)
      .json({ message: `No user Found with name : ${username}` });
  }
  const user = userFound.id;
  const newNote = {
    user,
    title,
    text,
  };
  const creatingNote = await Note.create(newNote);
  if (creatingNote) {
    res.status(200).json({ message: "Note Created Successfully" });
  } else {
    res.status(400).json({ message: "Could Not creat the note" });
  }
});

// Update Note
// patch /notes
const updateNote = asyncHandler(async (req, res) => {
  const { title, text, id, username } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  // finding note using id;
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: `No note found with id : ${id}` });
  }
  // checking if text was provided to update
  if (text) {
    note.text = text;
  }

  if (title) {
    note.title = title;
  }

  if (username) {
    const userFound = await User.findOne({ username }).exec();
    if (!userFound) {
      return res
        .status(400)
        .json({ message: `No user was found with name : ${username}` });
    }
    // if user was found
    const user = userFound.id;
    note.user = user;
  }
  const updatedNote = await note.save();
  res.status(200).json({ message: "Note was updated successfully" });
});

// Delete Note
// delete /notes
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    return res
      .status(400)
      .json({ message: `No note was found with ID : ${id}` });
  }

  const deletedNote = await note.deleteOne();
  if (!deletedNote) {
    return res.status(400).json({ message: "Could Not delete Note" });
  }
  res.status(200).json({ message: "Note was deleted Successfully" });
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
