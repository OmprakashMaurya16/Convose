const express = require("express");
const { isLoggedIn } = require("../middleware/auth.middleware.js");
const {
  getRecommendedUser,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequest,
  getOutgoingFriendRequest,
} = require("../controllers/user.controller.js");
const router = express.Router();

router.get("/", isLoggedIn, getRecommendedUser);
router.get("/friends", isLoggedIn, getMyFriends);

router.post("/friend_request/:id", isLoggedIn, sendFriendRequest);
router.put("/friend_request/:id/accept", isLoggedIn, acceptFriendRequest);

router.get("/friend_request", isLoggedIn, getFriendRequest);
router.get("/friend_request_send", isLoggedIn, getOutgoingFriendRequest);

module.exports = router;
