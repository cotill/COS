// components/unAuthorized.tsx
"use client";

import { signOutAction } from "@/app/actions";
import { useTransition } from "react";

export default default function UnauthorizedPage() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(() => {
      signOutAction(); // Server action to sign out and redirect
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
      <p className="mb-6">You do not have permission to access this page.</p>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        disabled={isPending}
      >
        {isPending ? "Signing Out..." : "Sign Out"}
      </button>
    </div>
  );
}
