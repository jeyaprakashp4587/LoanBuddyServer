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
        return res.status(200).json({ exists: existsHolder });
      }

      user.LoanHolders.push({
        LoanHolderName: loanHolderName,
        LoanHolderProfileImg: image || null,
        LoanHolderBalance: loanHolderAmount || 0,
        LoanHolderHistory: [],
      });

      await user.save(); // Ensure save is awaited

      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong", error: err });
  }
});

// Add balance
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

      return res.status(200).json({
        message: "Balance added successfully and loan holder moved to the top",
        loanHolder,
        user,
      });
    } else {
      return res.status(404).json({ message: "Loan holder not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
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
      // Check if the amount exceeds the current balance
      if (amount > user.LoanHolders[loanHolderIndex].LoanHolderBalance) {
        return res
          .status(400)
          .json({ message: "Amount exceeds available loan balance" });
      }

      // Subtract the balance
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

      return res.status(200).json({
        message:
          "Balance subtracted successfully and loan holder moved to the top",
        loanHolder,
        user,
      });
    } else {
      return res.status(404).json({ message: "Loan holder not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Delete loan holder
router.delete("/deleteLoanHolder/:userId/:loanHolderId", async (req, res) => {
  const { userId, loanHolderId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the loan holder with the matching loanHolderId
    user.LoanHolders = user.LoanHolders.filter(
      (loanHolder) => loanHolder._id.toString() !== loanHolderId
    );

    await user.save(); // Ensure save is awaited

    return res.status(200).json({
      message: "Loan holder deleted successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting loan holder", error });
  }
});

module.exports = router;

