import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

// ป้องกันเฉพาะ /studio/editor (ต้อง login) — /studio (landing/login นักเขียน) เปิดสาธารณะ
const isProtectedRoute = createRouteMatcher([
  "/studio/editor(.*)",
  "/studio/users(.*)",
  "/studio/comments(.*)",
]);
const isAuthRoute = createRouteMatcher([
  "/th/login(.*)",
  "/th/register(.*)",
]);

// ถ้ายังไม่ได้ตั้งคีย์ Clerk ใน env ให้ proxy ผ่านเฉย ๆ (public site ไม่ล่ม 500)
// /studio จะถูกป้องกันจริงเมื่อใส่คีย์ครบ
const hasClerk =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

const clerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req) && !isAuthRoute(req)) {
    await auth.protect();
  }
});

// Next.js 16.3+ — "middleware" file convention เปลี่ยนเป็น "proxy"
export default function proxy(req: NextRequest, event: NextFetchEvent) {
  if (!hasClerk) {
    return NextResponse.next();
  }
  return clerk(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|woff2?|ttf|map)).*)",
    "/(api|trpc)(.*)",
  ],
};
