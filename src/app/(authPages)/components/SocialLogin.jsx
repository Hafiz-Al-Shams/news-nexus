"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";

export default function SocialLogin() {
  const router = useRouter();
  const session = useSession();

  const handleSocialLogin = (providerName) => {
    signIn(providerName, { callbackUrl: "/" });
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  return (
    <div className="w-full">
      <button
        onClick={() => handleSocialLogin("google")}
        type="button"
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FaGoogle className="w-5 h-5 text-red-500" />
        <span className="text-gray-700 font-medium">Continue with Google</span>
      </button>
    </div>
  );
}