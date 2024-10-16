const express = require("express");
const router = express.Router();
const moment = require("moment");
const User = require("../Model/User");
// Add the API route to save loan holder details
router.post("/AddLoanHolder", async (req, res) => {
  const { loanHolderName, loanHolderAmount, image, id } = req.body;
  try {
    const user = await User.findById(id);
    if (user) {
      const existsHolder = user.LoanHolders.find(
        (name) =>
          name.LoanHolderName.toLowerCase() == loanHolderName.toLowerCase()
      );
      if (existsHolder) {
        res.status(200).json({ exits: existsHolder });
        return;
      }
      user.LoanHolders.push({
        LoanHolderName: loanHolderName,
        LoanHolderProfileImg: image ? image : null,
        LoanHolderBalance: loanHolderAmount ? loanHolderAmount : null,
        LoanHolderHistory: [],
      });
      user.save();
      res.json({ user: user });
    }
  } catch (err) {
    res.send("some thing wrong");
  }
});
// add and subtract
router.post("/addBalance", async (req, res) => {
  const { userId, loanHolderName, amount } = req.body;

  try {
    const user = await User.findById(userId);
    const loanHolderIndex = user.LoanHolders.findIndex(
      (holder) => holder.LoanHolderName === loanHolderName
    );

    if (loanHolderIndex !== -1) {
      // Update balance
      user.LoanHolders[loanHolderIndex].LoanHolderBalance += amount;

      // Save the transaction in LoanHolderHistory
      user.LoanHolders[loanHolderIndex].LoanHolderHistory.push({
        LoanType: "Added",
        LoanBalance: amount,
        Time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      // Move the loan holder to the first position in the array
      const [loanHolder] = user.LoanHolders.splice(loanHolderIndex, 1);
      user.LoanHolders.unshift(loanHolder);

      await user.save();
      res.status(200).json({
        message: "Balance added successfully and loan holder moved to the top",
        loanHolder,
        user,
      });
    } else {
      res.status(404).json({ message: "Loan holder not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Subtract balance
router.post("/subtractBalance", async (req, res) => {
  const { userId, loanHolderName, amount } = req.body;

  try {
    const user = await User.findById(userId);
    const loanHolderIndex = user.LoanHolders.findIndex(
      (holder) => holder.LoanHolderName === loanHolderName
    );

    if (loanHolderIndex !== -1) {
      // Update balance
      if (amount > user.LoanHolders[loanHolderIndex].LoanHolderBalance) {
  return res.json({ message: "Enter less than the Balance amount" });
}
      user.LoanHolders[loanHolderIndex].LoanHolderBalance -= amount;

      // Save the transaction in LoanHolderHistory
      user.LoanHolders[loanHolderIndex].LoanHolderHistory.push({
        LoanType: "Collected",
        LoanBalance: amount,
        Time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      // Move the loan holder to the first position in the array
      const [loanHolder] = user.LoanHolders.splice(loanHolderIndex, 1);
      user.LoanHolders.unshift(loanHolder);

      await user.save();
      res.status(200).json({
        message:
          "Balance subtracted successfully and loan holder moved to the top",
        loanHolder,
        user,
      });
    } else {
      res.status(404).json({ message: "Loan holder not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// delete the loan holder
router.delete("/deleteLoanHolder/:userId/:loanHolderId", async (req, res) => {
  const { userId, loanHolderId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Filter out the loan holder that matches the loanHolderId
    user.LoanHolders = user.LoanHolders.filter(
      (loanHolder) => loanHolder._id.toString() !== loanHolderId
    );
    // Save the updated user
    await user.save();
    res.status(200).json({ message: "Loan holder deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting loan holder", error });
  }
});

module.exports = router;
