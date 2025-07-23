const User = require("../models/Users");
const FriendRequest = require("../models/FriendRequest");

// Get Recommended Users (not friends and onboarded)
module.exports.getRecommendedUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const recommendedUsers = await User.find({
      _id: { $ne: currentUserId, $nin: currentUser.friends },
      isOnboarded: true,
    }).select("fullName profilePic location bio");

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommendedUser controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get My Friends
module.exports.getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic location");

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriends controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send Friend Request
module.exports.sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with the user" });
    }

    const existingRequest = await FriendRequest.findOne({
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

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
      status: "pending",
    });

    res.status(200).json(friendRequest);
  } catch (error) {
    console.log("Error in sendFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept Friend Request
module.exports.acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Friend Requests (incoming + accepted)
module.exports.getFriendRequest = async (req, res) => {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic location");

    const acceptedRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic location");

    res.status(200).json({
      incoming: incomingRequests,
      accepted: acceptedRequests,
    });
  } catch (error) {
    console.log("Error in getFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Outgoing Friend Requests
module.exports.getOutgoingFriendRequest = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic location");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
