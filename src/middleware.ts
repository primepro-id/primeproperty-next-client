import { NextRequest, NextResponse } from "next/server";
import { refreshAgentSession, verifyAgentSession } from "./lib/api";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const response = NextResponse.next();
  try {
    const currentSession = await verifyAgentSession(accessToken);
    if (currentSession.data?.status !== "OK") {
      const refreshToken = request.cookies.get("refreshToken")?.value as string;
      const newSession = await refreshAgentSession(refreshToken);
      if (newSession.data?.accessToken && newSession.data.refreshToken) {
        response.cookies.set("accessToken", newSession.data.accessToken.token, {
          maxAge: 60 * 60 * 24,
        }); // 1 day
        response.cookies.set(
          "refreshToken",
          newSession.data.refreshToken.token,
          {
            maxAge: 60 * 60 * 24,
          },
        );
      } else {
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
      }
    }

    return response;
  } catch (error) {
    console.error("MIDDLEWARE ERRROR:\n", error);
    return response;
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path"],
};
