const { upsertStreamUser } = require("../lib/stream");
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

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });

      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating stream user:", error);
    }

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

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successfully" });
};

module.exports.onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, location } = req.body;

    if (!fullName || !bio || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        location,
        isOnboarded: true,
      },
      { new: true }
    );

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding : ${updatedUser.fullName} `
      );
    } catch (streamError) {
      console.log(
        "Error in updating stream user during onboard : ",
        streamError
      );
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
