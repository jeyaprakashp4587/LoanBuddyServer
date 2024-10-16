const express = require("express");
const router = express.Router();
const User = require("../Model/User");
router.post("/updateStoreImage", async (req, res) => {
  const { id, Image } = req.body;
  //   console.log(id, Image);
  const user = await User.findById(id);
  if (user) {
    user.storeImg = Image;
    await user.save();
    res.send(user);
  }
});
module.exports = router;
