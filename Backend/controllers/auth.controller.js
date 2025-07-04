const User = require("../models/Users");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a different one" });
    }

    const randomIdx = Math.floor(Math.random() * 100) + 1;
    const profilePic = `https://avatar.iran.liara.run/public/${randomIdx}.png`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.login = (req, res) => {
  res.send("login");
};

module.exports.logout = (req, res) => {
  res.send("logout");
};
