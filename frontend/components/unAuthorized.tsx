"use client";

import { useTransition } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { signOutAction } from "@/app/actions";

export default function UnauthorizedPage() {
  const [isPending, startTransition] = useTransition();
  const supabase = createClientComponentClient();

  const handleSignOut = () => {
    startTransition(async () => {
      await supabase.auth.signOut(); 
      await signOutAction();         
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
