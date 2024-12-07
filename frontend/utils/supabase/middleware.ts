import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // protected routes
    if (user.data.user ===null && !request.nextUrl.pathname.startsWith("/sign-in")) {
      console.log("redirect user to sign-in page")
      //if we don't have a user go to sign-in
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    //if we have a user and they want to login, take them to dashboard instead



    if ((request.nextUrl.pathname.startsWith("/sign-in") ||request.nextUrl.pathname === "/") && user.data.user) {
      const { data: employeeInfo, error: empError } = await supabase.from("Employees").select("*").eq("Employee_id", user.data.user?.id).single();
      const { data: studentInfo, error: stuError } = await supabase.from("Students").select("*").eq("Employee_id", user.data.user?.id).single();
      if (employeeInfo) {
        return NextResponse.redirect(new URL("/Employee", request.url)
        );
      }if (!studentInfo) {
        return NextResponse.redirect(
          new URL("/Employee", request.url)
        );
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
