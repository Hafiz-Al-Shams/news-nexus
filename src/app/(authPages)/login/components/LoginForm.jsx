"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import SocialLogin from "../../components/SocialLogin";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

export default function LoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Sync session with Redux after login
  useEffect(() => {
    if (session?.user) {
      dispatch(setUser(session.user));
    }
  }, [session, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    setIsLoading(true);
    toast.loading("Logging in...");

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      toast.dismiss();

      if (response?.ok) {
        toast.success("Logged in successfully!");
        // Session will be synced to Redux via useEffect
        router.push("/");
        form.reset();
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-gray-500">Sign in to your account to continue.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="your@example.com"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Forgot Password */}
        <div className="text-center mb-6">
          <Link
            href="/reset-password"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Forgot Password?
          </Link>
        </div>
      </form>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <SocialLogin />

      {/* Footer Links */}
      <div className="text-center text-sm text-gray-600 mt-6">
        <p className="mb-3">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoArrowForwardCircleOutline className="mr-1 w-5 h-5" />
          Go Back
        </Link>
      </div>
    </div>
  );
}