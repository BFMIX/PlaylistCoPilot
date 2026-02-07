import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/connections?error=no_code`
    )
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/youtube`,
      }),
    })

    if (!tokenRes.ok) {
      const error = await tokenRes.text()
      throw new Error(`Token exchange failed: ${error}`)
    }

    const tokens = await tokenRes.json()

    // Get user info
    const userRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userRes.ok) {
      throw new Error("Failed to fetch user info")
    }

    const googleUser = await userRes.json()

    // Store connection
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_session`
      )
    }

    await supabase.from("connections").upsert({
      user_id: session.user.id,
      provider: "youtube",
      provider_user_id: googleUser.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      scope: tokens.scope,
      status: "connected",
      capabilities: { can_read: true, can_write: true, can_export: true },
      last_used_at: new Date().toISOString(),
    })

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/connections?success=youtube_connected`
    )
  } catch (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/connections?error=youtube_failed`
    )
  }
}
