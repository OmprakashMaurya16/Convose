import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Check,
  X,
  User,
  Clock,
  CheckCircle,
  Bell,
  MessageSquare,
} from "lucide-react";

const NoNotificationsFound = () => (
  <div className="text-center text-gray-400 py-10">
    <p>No new notifications.</p>
  </div>
);

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const {
    data: friendRequests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const res = await axios.get("/users/friend_request");
      return res.data;
    },
  });

  const { mutate: acceptRequest, isPending: isAccepting } = useMutation({
    mutationFn: (id) => axios.put(`/users/friend_request/${id}/accept`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: rejectRequest, isPending: isRejecting } = useMutation({
    mutationFn: (id) => axios.put(`/users/friend_request/${id}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 space-y-8">
      <div className="flex items-center gap-2 text-xl font-semibold">
        <Bell className="w-5 h-5 text-blue-400" />
        Notifications
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400">
          Failed to load notifications.
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <div className="text-lg font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Friend Requests
            </div>

            <div className="space-y-3">
              {incomingRequests.map((request) => (
                <div
                  key={request._id}
                  className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="avatar w-14 h-14 rounded-full bg-base-300 overflow-hidden">
                          <img
                            src={request.sender.profilePic}
                            alt={request.sender.fullName}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {request.sender.fullName}
                          </h3>
                          <p className="text-xs opacity-70">
                            New friend request
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => acceptRequest(request._id)}
                          disabled={isAccepting}
                        >
                          <Check className="h-4 w-4" /> Accept
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => rejectRequest(request._id)}
                          disabled={isRejecting}
                        >
                          <X className="h-4 w-4" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {acceptedRequests.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                New Connections
              </h2>

              <div className="space-y-3">
                {acceptedRequests.map((notification) => (
                  <div
                    key={notification._id}
                    className="card bg-base-200 shadow-sm hover:shadow-md"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-start gap-3">
                        <div className="avatar mt-1 size-10 rounded-full overflow-hidden">
                          <img
                            src={notification.recipient.profilePic}
                            alt={notification.recipient.fullName}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {notification.recipient.fullName}
                          </h3>
                          <p className="text-sm my-1">
                            {notification.recipient.fullName} accepted your
                            friend request
                          </p>
                          <p className="text-xs flex items-center opacity-70">
                            <Clock className="h-3 w-3 mr-1" />
                            Recently
                          </p>
                        </div>
                        <div className="badge badge-success">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          New Friend
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
            <NoNotificationsFound />
          )}
        </>
      )}
    </div>
  );
};

export default NotificationPage;
