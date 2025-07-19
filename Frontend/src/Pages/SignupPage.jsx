import React, { useState } from "react";
import useSignUp from "../hooks/useSignUp.js";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (event) => {
    event.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/70">Join us today and get started</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={signupData.fullName}
              onChange={(e) =>
                setSignupData({ ...signupData, fullName: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>{" "}
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center mt-2">
              {error.response.data.message}
            </p>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
