import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: async (userData) => {
      const response = await axiosInstance.get("/users/friends", userData);
      return response.data;
    },
  });

  const { data: recommendedUsers = [], isLoading: loadingUser } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users");
      return response.data;
    },
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/friend_request_send");
      return response.data;
    },
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: async (userId) => {
      const response = await axiosInstance.post(
        `/users/friend_request/${userId}`
      );
      return response.data;
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return <div>Home</div>;
};

export default HomePage;
