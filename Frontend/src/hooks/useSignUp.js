import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (signupData) => {
      const response = await axiosInstance.post("/auth/signup", signupData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { isPending, error, signupMutation: mutate };
};

export default useSignUp;
