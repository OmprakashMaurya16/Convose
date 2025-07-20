import React from "react";
import { Link } from "react-router-dom";
import { MessageSquareIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition-shadow border border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-600">
          <img
            src={friend.profilePic}
            alt={friend.fullName}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-white font-semibold text-lg truncate">
          {friend.fullName}
        </h3>
      </div>

      <Link
        to={`/chat/${friend._id}`}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
      >
        <MessageSquareIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Message</span>
      </Link>
    </div>
  );
};

export default FriendCard;
