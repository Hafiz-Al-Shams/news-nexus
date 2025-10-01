"use client";

import { signOut, useSession } from "next-auth/react";


export default function Home() {

  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <h1>Hello World</h1>
      {session && (
        <div>
          <p>Logged in as: {session.user?.email}</p>
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
