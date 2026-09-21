import { NextRequest, NextResponse } from "next/server";

// Fast edge guard: only checks that a session/guest cookie exists.
// The dashboard page itself re-validates the session against the database,
// so an expired or forged cookie still gets redirected to /.
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has("ft_session");
  const hasGuest = request.cookies.has("ft_guest");
  if (!hasSession && !hasGuest) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
