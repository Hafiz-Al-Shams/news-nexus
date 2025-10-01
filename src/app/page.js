"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout as reduxLogout } from "@/store/slices/userSlice";

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
    <>
      <h1>Hello World</h1>
      {isAuthenticated && user && (
        <div>
          <p>Logged in as: {user.email}</p>
          <p>Name: {user.name}</p>
          <p>Redux State: {isAuthenticated ? "Authenticated" : "Not Authenticated"}</p>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}