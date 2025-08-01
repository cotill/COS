import { signOutAction } from "@/app/actions";
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


  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth callback: failed to get user", userError?.message);
    return NextResponse.redirect(`${origin}/sign-in`);
  }


  const { data: employeeInfo } = await supabase
    .from("Employees")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  if (employeeInfo) {
    return NextResponse.redirect(`${origin}/Employee/Projects`);
  }

 
  const { data: studentInfo } = await supabase
    .from("Students")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  if (studentInfo) {
    return NextResponse.redirect(`${origin}/Student/Tasks`);
  }

  else{
    await signOutAction();
    return NextResponse.redirect(`${origin}/unauthorized`);
  }
}
