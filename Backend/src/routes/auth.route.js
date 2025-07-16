const express = require("express");
const {
  signup,
  login,
  logout,
  onboard,
} = require("../controllers/auth.controller.js");
const { isLoggedIn } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", isLoggedIn, onboard);

router.get("/me", isLoggedIn, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;
