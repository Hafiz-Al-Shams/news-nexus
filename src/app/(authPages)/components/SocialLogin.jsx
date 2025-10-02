"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

export default function SocialLogin() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleSocialLogin = (providerName) => {
    signIn(providerName, { callbackUrl: "/" });
  };

  // Sync session with Redux
  useEffect(() => {
    if (session?.user) {
      dispatch(setUser(session.user));
    }
  }, [session, dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if (status === "authenticated" && isAuthenticated) {
      router.push("/");
    }
  }, [status, isAuthenticated, router]);

  return (
    <div className="w-full">
      <button
        onClick={() => handleSocialLogin("google")}
        type="button"
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FaGoogle className="w-5 h-5" />
        <span className="text-gray-700 font-medium">Continue with Google</span>
      </button>
    </div>
  );
}