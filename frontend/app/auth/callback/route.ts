import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("🔄 Auth callback started");
  
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  console.log("📋 Callback parameters:", {
    code: code ? "✅ Present" : "❌ Missing",
    origin,
    redirectTo,
    fullUrl: request.url
  });

  const supabase = await createClient();

  if (code) {
    console.log("🔑 Exchanging code for session...");
    await supabase.auth.exchangeCodeForSession(code);
    console.log("✅ Code exchange completed");
  } else {
    console.log("⚠️ No auth code found in callback");
  }


  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("👤 User authentication check:", {
    userExists: !!user,
    userEmail: user?.email,
    userId: user?.id,
    error: userError?.message
  });

  if (userError || !user) {
    console.error("❌ Auth callback: failed to get user", userError?.message);
    console.log("🔄 Redirecting to sign-in page");
    return NextResponse.redirect(`${origin}/sign-in`);
  }


  console.log("🔍 Checking if user is an employee...");
  const { data: employeeInfo } = await supabase
    .from("Employees")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  console.log("👔 Employee check result:", {
    isEmployee: !!employeeInfo,
    employeeData: employeeInfo ? "Found" : "Not found"
  });

  if (employeeInfo) {
    console.log("✅ User is employee, redirecting to Employee/Projects");
    return NextResponse.redirect(`${origin}/Employee/Projects`);
  }

  console.log("🔍 Checking if user is a student...");
  const { data: studentInfo } = await supabase
    .from("Students")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  console.log("🎓 Student check result:", {
    isStudent: !!studentInfo,
    studentData: studentInfo ? "Found" : "Not found"
  });

  if (studentInfo) {
    console.log("✅ User is student, redirecting to Student/Tasks");
    return NextResponse.redirect(`${origin}/Student/Tasks`);
  }

  else{
    console.log("❌ User not found in Employees or Students tables");
    console.log("🚪 Signing out user and redirecting to unauthorized");
    await signOutAction();
    return NextResponse.redirect(`${origin}/unauthorized`);
  }
}
