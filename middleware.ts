import { NextRequest, NextResponse } from "next/server";

// 才弥さん専用ゲート。
// APP_PASSWORD が設定されている時だけ動作する（ローカル開発では未設定でバイパス）。
// 認証済みクッキー (clau-auth) があれば通過、無ければ /gate へリダイレクト。

export const AUTH_COOKIE = "clau-auth";

export function middleware(req: NextRequest) {
  const password = process.env.APP_PASSWORD;
  if (!password) return NextResponse.next(); // 未設定 = ゲートを使わない

  const { pathname } = req.nextUrl;

  // 静的アセット・ゲート関連は素通し
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/gate") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const authed = req.cookies.get(AUTH_COOKIE)?.value === "1";
  if (authed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/gate";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
