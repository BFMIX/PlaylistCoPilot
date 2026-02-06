import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function isProtectedPath(pathname: string) {
  // adapte si tu ajoutes des pages
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/connections") ||
    pathname.startsWith("/playlists") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/supported-services") ||
    pathname.startsWith("/feedback")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore les assets & API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Laisse /login et la landing
  if (pathname === "/" || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Prépare la réponse (important pour les cookies)
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Rafraîchit la session si besoin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedPath(pathname) && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
