const User = require("../models/Users");
const FriendRequest = require("../models/FriendRequest.js");

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

module.exports.sendFriendRequest = async (req, res) => {
  try {
    let myId = req.user.id;
    let { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(400).json({ message: "Recipient not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with the user" });
    }

    const existingRequest = await User.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const friendRequest = await User.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(200).json(friendRequest);
  } catch (error) {
    console.log("Error in the sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.acceptFriendRequest = async (req, res) => {
  try {
    const { id: recipientId } = req.params;

    const friendRequest = await FriendRequest.findById(recipientId);
    if (!friendRequest) {
      return res.status(400).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await friendRequest.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await friendRequest.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in the acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getFriendRequest = async (req, res) => {
  try {
    const inComingRequest = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic location");

    const acceptFriendRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic location");

    res.status(200).json(inComingRequest, acceptFriendRequest);
  } catch (error) {
    console.log("Error in getFriendRequest controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getOutgoingFriendRequest = async (req, res) => {
  try {
    const outComingRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic location ");
  } catch (error) {
    console.log("Error in getOutgoingFriendRequest :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
