import React from "react";
import UnauthorizedPage from "@/components/unAuthorized";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: userInfo, error: authError } = await supabase.auth.getUser();
  let metadata = userInfo.user?.user_metadata;

  if (!userInfo.user || authError) {
    redirect("/sign-in");
  }

  const { data: studentInfo, error: stuError } = await supabase.from("Students").select("*").eq("student_id", userInfo.user.id).single();

  if (!studentInfo || stuError) {
    return <UnauthorizedPage />;
  }

  // console.log('Employee Info:', employeeInfo);

  const [firstName, lastName] = studentInfo.full_name ? studentInfo.full_name.split(" ") : ["N/A", "N/A"];
  return (
    <div>
      {firstName}+ " "{lastName}
      {children}
    </div>
  );
}
