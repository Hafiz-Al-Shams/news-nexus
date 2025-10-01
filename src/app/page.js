"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout as reduxLogout } from "@/store/slices/userSlice";
import AIChat from "@/components/AIChat";

export default function Home() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Sync NextAuth session with Redux store
  useEffect(() => {
    if (session?.user) {
      dispatch(setUser(session.user));
    } else {
      dispatch(reduxLogout());
    }
  }, [session, dispatch]);

  const handleLogout = async () => {
    dispatch(reduxLogout()); // Clear Redux state first
    await signOut({ callbackUrl: "/" }); // Then clear NextAuth session
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hello World</h1>

      {isAuthenticated && user ? (
        <div>
          {/* User Info Section */}
          <div className="mb-8 p-4 bg-gray-100 rounded-lg">
            <p className="mb-2">
              <strong>Logged in as:</strong> {user.email}
            </p>
            <p className="mb-2">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="mb-4">
              <strong>Redux State:</strong>{" "}
              {isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </p>
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* AI Chat Section */}
          <AIChat />
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 mb-4">
            Welcome! Please login to access AI chat.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      )}
    </div>
  );
}