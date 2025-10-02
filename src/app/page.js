"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout as reduxLogout } from "@/store/slices/userSlice";
import toast from "react-hot-toast";
import Link from "next/link";

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
      <div className="min-h-screen flex items-center justify-center">
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">NewsNexus</h1>
            </div>

            {/* Right side - Login button or User info */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
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
      </header>

      {/* Main Content - Empty for future work */}
      <main className="container mx-auto px-4 py-8">
        {/* Content will be added here in the future */}
      </main>
    </div>
  );
}