// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const bcrypt = require("bcryptjs");

// Route for saving user data (Sign In)
router.post("/signIn", async (req, res) => {
  const { storeName, phoneNumber, password } = req.body;

  try {
    // Check if the phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already taken." });
    }

    // Create and save the new user
    const user = new User({ storeName, phoneNumber, password: hashedPassword });
    await user.save();

    // Send success response
    res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "An error occurred, please try again." });
  }
});
// login
router.post("/signUp", async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({ message: "Phone number not found" });
    }

    // Check if the password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // If everything is correct, send a success response
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// valid
router.get("/valid/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const user = await User.findById(id);
  if (user) {
    res.send(user);
  }
});

module.exports = router;
