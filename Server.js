// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { DB } = require("./Database/DB");
const login = require("./Router/Login");
const User = require("./Router/User");
const LoanHolder = require("./Router/LoanHolder");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To handle JSON requests
DB.on("connected", () => console.log("DB connected"));
app.use("/login", login);
app.use("/user", User);
app.use("/LoanHolder", LoanHolder);
// MongoDB connection

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
