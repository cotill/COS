import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
/**
 * Since server Componenents can't write cookies, middleware is used to refresh the auth token and store them
 * middleware:
 * - Refreshes the auth token(by calling supabase.auth.getUser())
 * - Passes the refreshed auth token to the server component, so they don't attempt to refresh the same token (request.cookies.set)
 * - Passes the refreshed Auth token to the browser, so it replaces the old token (response.cookies.set)
 *
 * @param request
 * @returns
 */

export async function middleware(request: NextRequest) {
  console.log("middleware is running");
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
