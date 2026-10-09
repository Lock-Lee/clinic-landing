import { NextResponse, type NextRequest } from "next/server";

// ด่านแรก: ไม่มี cookie ไป /login เลย (ตรวจ session จริงในแต่ละหน้าและ route อีกที)
export function middleware(req: NextRequest) {
  if (!req.cookies.has("clinic_admin")) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|api|_next|favicon.ico).*)"],
};
