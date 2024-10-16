// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { DB } = require("../Database/DB");

const userSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  storeImg: String,
  LoanHolders: [
    {
      LoanHolderName: String,
      LoanHolderProfileImg: String,
      LoanHolderBalance: Number,
      LoanHolderHistory: [
        {
          LoanType: String,
          LoanBalance: Number,
          Time: String,
        },
      ],
    },
  ],
});
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = DB.model("User", userSchema);
