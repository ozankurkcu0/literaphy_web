import { NextResponse } from "next/server";
import { MYPANEL_SESSION_COOKIE_NAME } from "@/lib/mypanel-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(MYPANEL_SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
