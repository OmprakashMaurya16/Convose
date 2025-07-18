import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderIcon, toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { CameraIcon, Loader, ShipWheelIcon, ShuffleIcon } from "lucide-react";

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post("/auth/onboarding", userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile onboarded successfully.");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const randomAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
      <div className="w-full max-w-2xl bg-base-100 rounded-2xl shadow-xl border border-base-300 p-8 md:p-10 space-y-6">
        <h2 className="text-3xl font-bold text-center text-base-content">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full border border-base-300 overflow-hidden bg-base-200 group">
              {formState.profilePic ? (
                <img
                  src={formState.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <CameraIcon className="w-8 h-8 text-base-content opacity-40" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRandomAvatar}
              className="btn btn-accent btn-sm"
            >
              <ShuffleIcon className="size-4 mr-1" />
              Random Avatar
            </button>
          </div>

          {/* Full Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formState.fullName}
              onChange={(e) =>
                setFormState({ ...formState, fullName: e.target.value })
              }
              placeholder="Enter your full name"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Bio</span>
            </label>
            <textarea
              name="bio"
              value={formState.bio}
              onChange={(e) =>
                setFormState({ ...formState, bio: e.target.value })
              }
              placeholder="Write a short bio"
              className="textarea textarea-bordered w-full resize-none"
              rows={3}
            />
          </div>

          {/* Location */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={formState.location}
              onChange={(e) =>
                setFormState({ ...formState, location: e.target.value })
              }
              placeholder="Your current location"
              className="input input-bordered w-full"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button type="submit" className="btn btn-primary btn-block">
              {isPending ? (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              ) : (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnBoardingPage;
