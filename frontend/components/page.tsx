// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error getting user:", error?.message);
        router.push("/sign-in");
        return;
      }

      const { data: employeeInfo, error: empError } = await supabase
        .from("Employees")
        .select("*")
        .eq("email", user.email)
        .single();

      if (empError || !employeeInfo) {
        router.push("/Student/Tasks");
      } else {
        router.push("/Employee/Projects");
      }
    };

    redirectUser();
  }, [router]);

  return <p className="p-4">Signing you in...</p>;
}
