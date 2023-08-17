const User = require("../models/Users");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// GET all users
// GET /users

// we will use async handler so we dont have to use try catch everywhere, to do that we just need to wrap the async function inside async handler
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No Users were found" });
  }

  res.json(users);
});

// Create a new User
// POST /users

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All Data is required" });
  }

  // check for duplicates
  // we need to call exec() when we call a find method with a parameter/feild defined
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate User" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10); // salt rounds

  // create new user
  const userObject = {
    username,
    password: hashedPassword,
    roles,
  };

  const user = await User.create(userObject);

  if (user) {
    res
      .status(200)
      .json({ message: `New user ${username} created successfully` });
  } else {
    res.status(400).json({ message: "Invalid user data recieved" });
  }
});

// Update a User
// patch /users

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, password, active } = req.body;
  if (
    !id ||
    !username ||
    !roles.length ||
    !Array.isArray(roles) ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All feilds are required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User Not found" });
  }

  // we can also check for duplicates here if we want (I'm not doing it)

  // now updating the user
  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }

  const updatedUser = await user.save();

  res.json({ message: `User updated : ${updatedUser}` });
});

// Delete a User
// Delete /users

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "No id provided" });
  }
  // check if user has assigned notes

  const notes = await Note.findOne({ user: id }).lean().exec();

  if (notes) {
    return res.status(409).json({ message: "User has assigned notes" });
  }

  // finding the user
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json("User Not found");
  }
  const deletedUser = await user.deleteOne();
  console.log(deletedUser);
  console.log(deletedUser._id);
  const reply = `User : ${deletedUser.username} with ID : ${deletedUser.id} has been deleted successfully`;

  res.json({ message: reply });
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
