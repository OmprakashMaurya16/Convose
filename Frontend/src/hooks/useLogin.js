import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const useLogin = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (loginData) => {
      const res = await axiosInstance.post("/auth/login", loginData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { isPending, error, loginMutation: mutate };
};

export default useLogin;
