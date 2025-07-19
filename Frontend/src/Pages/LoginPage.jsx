import React, { useState } from "react";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/70">Login to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-white/90 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white/90 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>{" "}
                Loading...
              </>
            ) : (
              "Login Account"
            )}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center mt-2">
              {error?.response?.data?.message || "Login failed"}
            </p>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            Don't have an account yet?{" "}
            <a
              href="/signup"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
