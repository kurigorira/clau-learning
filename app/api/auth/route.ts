import { NextResponse } from "next/server";

const COOKIE_NAME = "clau-auth";
const MAX_AGE_DAYS = 30;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(req: Request) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    // ローカル開発などで未設定 → ゲートはオフ。常に成功扱い。
    const res = NextResponse.json({ ok: true });
    return res;
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "形式エラー" }, { status: 400 });
  }

  const given = (body.password ?? "").trim();
  if (!given || !timingSafeEqual(given, expected)) {
    return NextResponse.json(
      { ok: false, error: "合言葉がちがいます" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: "1",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * MAX_AGE_DAYS,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
