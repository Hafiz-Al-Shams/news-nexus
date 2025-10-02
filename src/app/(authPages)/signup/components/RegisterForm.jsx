"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import SocialLogin from "../../components/SocialLogin";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

export default function RegisterForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Sync session with Redux (in case of social login during registration)
  useEffect(() => {
    if (session?.user) {
      dispatch(setUser(session.user));
    }
  }, [session, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    setIsLoading(true);
    toast.loading("Creating your account...");

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      toast.dismiss();

      if (response.ok) {
        toast.success("Registration successful!");
        form.reset();
        router.push("/login");
        toast("Now please login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Us Today!</h2>
        <p className="text-gray-500">Create your account to unlock full features.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your Full Name"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@example.com"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
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
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoArrowForwardCircleOutline className="mr-1 w-5 h-5" />
          Go Home
        </Link>
      </div>
    </div>
  );
}