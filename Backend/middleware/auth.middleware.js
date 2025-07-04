const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");

module.exports.isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in isLoggedIn middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
