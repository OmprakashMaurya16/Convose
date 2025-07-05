const express = require("express");
const { isLoggedIn } = require("../middleware/auth.middleware");
const { getStreamToken } = require("../controllers/chat.controller.js");

const router = express.Router();

router.get("/token", isLoggedIn, getStreamToken);

module.exports = router;
