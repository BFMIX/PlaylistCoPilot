import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, platform, title, message, email } = body

    // Validation
    if (!type || !title || !message) {
      return NextResponse.json(
        { error: "Type, title and message are required" },
        { status: 400 }
      )
    }

    const validTypes = ["bug", "feature", "platform_request", "other"]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Get current user if authenticated
    const { data: { session } } = await supabase.auth.getSession()

    // Insert feature request
    const { data, error } = await supabase
      .from("feature_requests")
      .insert({
        user_id: session?.user?.id || null,
        email: email || null,
        type,
        platform: platform || null,
        title: title.trim(),
        message: message.trim(),
        status: "new",
        votes_count: 1, // Auto-upvote own request
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting feature request:", error)
      return NextResponse.json(
        { error: "Failed to save request" },
        { status: 500 }
      )
    }

    // If user is authenticated, add their vote
    if (session?.user) {
      await supabase.from("feature_votes").insert({
        feature_request_id: data.id,
        user_id: session.user.id,
      })
    }

    return NextResponse.json(
      { success: true, id: data.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error in feedback submit:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("feature_requests")
    .select("*")
    .order("votes_count", { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    )
  }

  return NextResponse.json({ data })
}
