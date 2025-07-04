const User = require("../models/Users");

module.exports.getRecommendedUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById({ currentUserId });

    const recommendedUser = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { $id: { $nin: currentUser.friends } },
        {
          isOnboarded: true,
        },
      ],
    });

    res.status(200).json(recommendedUser);
  } catch (error) {
    console.log("Error in getRecommendedUser controller :", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic location");

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriends controller :", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
