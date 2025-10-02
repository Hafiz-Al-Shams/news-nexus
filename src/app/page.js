"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout as reduxLogout } from "@/store/slices/userSlice";
import toast from "react-hot-toast";
import Link from "next/link";
import NewsSection from "@/components/NewsSection";

export default function Home() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Sync NextAuth session with Redux store
  useEffect(() => {
    if (session?.user) {
      dispatch(setUser(session.user));
    } else if (status !== "loading") {
      dispatch(reduxLogout());
    }
  }, [session, status, dispatch]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      dispatch(reduxLogout());
      await signOut({ callbackUrl: "/" });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
      setIsLoggingOut(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">NewsNexus</h1>
            </Link>

            {/* Right side - Navigation */}
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <>
                  {/* User info - Desktop */}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isAuthenticated && user ? (
          // Logged In - Show News
          <>
            {/* Welcome Banner - Mobile Only */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-4 mb-6 text-white sm:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg font-bold">
                  {user.name?.[0]?.toUpperCase() ||
                    user.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <div>
                  <p className="text-sm text-blue-100">Welcome back!</p>
                  <p className="font-semibold">{user.name || "User"}</p>
                </div>
              </div>
            </div>

            {/* News Section */}
            <NewsSection />
          </>
        ) : (
          // Not Logged In - Landing Page
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-2xl">
              {/* Hero Icon */}
              <div className="mb-6">
                <div className="inline-block p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                  <svg
                    className="w-20 h-20 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
              </div>

              {/* Hero Text */}
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
                Welcome to NewsNexus
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Your gateway to the latest news from around the world. Stay
                informed with real-time updates across multiple categories and
                regions.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  Get Started - Login
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all font-semibold text-lg"
                >
                  Create Account
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-4xl mb-3">🌍</div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Global Coverage
                  </h3>
                  <p className="text-sm text-gray-600">
                    News from Asia, Europe, America, and worldwide
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-4xl mb-3">⏰</div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Real-Time Updates
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get news from the last hour to 24 hours
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-4xl mb-3">📰</div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Multiple Categories
                  </h3>
                  <p className="text-sm text-gray-600">
                    Science, Sports, Business, Technology & more
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              © 2025 NewsNexus. Powered by{" "}
              <a
                href="https://newsapi.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                NewsAPI
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}