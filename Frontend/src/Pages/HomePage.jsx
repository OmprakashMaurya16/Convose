import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { Link } from "react-router-dom";
import { User, MapPin, CheckCircle, UserPlus } from "lucide-react";
import FriendCard from "../components/FriendCard.jsx";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/friends");
      return data;
    },
  });

  const { data: recommendedUsers = [], isLoading: loadingRecommended } =
    useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const { data } = await axiosInstance.get("/users");
        return data;
      },
    });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/friend_request_send");
      return data;
    },
  });

  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: async (userId) => {
      const { data } = await axiosInstance.post(
        `/users/friend_request/${userId}`
      );
      return data;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries(["outgoingFriendReqs"]);
      setOutgoingRequestsIds((prev) => new Set([...prev, userId]));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["outgoingFriendReqs"]);
    },
    onError: (error, userId) => {
      setOutgoingRequestsIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    },
  });

  useEffect(() => {
    if (outgoingFriendReqs?.length) {
      const ids = outgoingFriendReqs.map(
        (req) => req.receiverId || req.userId || req._id || req.id
      );
      setOutgoingRequestsIds(new Set(ids));
    } else {
      setOutgoingRequestsIds(new Set());
    }
  }, [outgoingFriendReqs]);

  const handleSendRequest = (userId) => {
    sendRequestMutation(userId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto space-y-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Your Friends
            </h2>
            <Link
              to="/notification"
              className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-sm text-white rounded-lg hover:bg-gray-800 transition"
            >
              <User className="w-4 h-4" />
              Friend Requests
            </Link>
          </div>
          {loadingFriends ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : friends.length === 0 ? (
            <p className="text-gray-400 py-8">No friends yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Meet New Users
            </h2>
          </div>
          {loadingRecommended ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
              <h3 className="font-medium text-white mb-1">
                No recommendations available
              </h3>
              <p className="text-gray-400 text-sm">
                Check back later for new recommended users
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-5"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePic || "/default-avatar.png"}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-white">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {user.bio && (
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                      <button
                        className={`w-full py-2 px-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2 ${
                          hasRequestBeenSent
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                        onClick={() => handleSendRequest(user._id)}
                        disabled={hasRequestBeenSent}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Send Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
