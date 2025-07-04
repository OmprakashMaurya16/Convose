const express = require("express");
const { isLoggedIn } = require("../middleware/auth.middleware.js");
const {
  getRecommendedUser,
  getMyFriends,
} = require("../controllers/user.controller.js");
const router = express.Router();

router.get("/", isLoggedIn, getRecommendedUser);
router.get("/friends", isLoggedIn, getMyFriends);

module.exports = router;
