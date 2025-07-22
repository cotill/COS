import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // After exchanging the session, get the user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth callback: failed to get user", userError?.message);
    return NextResponse.redirect(`${origin}/sign-in`);
  }

  // Check if user is in Employees table
  const { data: employeeInfo, error: empError } = await supabase
    .from("Employees")
    .select("*")
    .eq("email", user.email)
    .single();

  if (empError || !employeeInfo) {
    return NextResponse.redirect(`${origin}/Student/Tasks`);
  } else {
    return NextResponse.redirect(`${origin}/Employee/Projects`);
  }
}
