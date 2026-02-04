import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { isValidEmail, hashIp } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, source, tags = [], locale } = body

    // Validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    if (!source) {
      return NextResponse.json(
        { error: "Source is required" },
        { status: 400 }
      )
    }

    // Rate limiting check (simple IP-based)
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const ipHash = await hashIp(ip)

    const supabase = createClient()

    // Check if email already exists
    const { data: existing } = await supabase
      .from("leads")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (existing) {
      // Update preferences if lead exists
      await supabase
        .from("leads")
        .update({
          wants_apple_full: tags.includes("apple_music_full"),
          metadata: { tags, last_source: source },
        })
        .eq("id", existing.id)

      return NextResponse.json(
        { success: true, message: "Already subscribed, preferences updated" },
        { status: 200 }
      )
    }

    // Insert new lead
    const { error } = await supabase.from("leads").insert({
      email: email.toLowerCase().trim(),
      source,
      locale: locale || "en",
      wants_apple_full: tags.includes("apple_music_full"),
      wants_lifetime_deal: tags.includes("lifetime_deal"),
      metadata: { tags },
      ip_hash: ipHash,
    })

    if (error) {
      console.error("Error inserting lead:", error)
      return NextResponse.json(
        { error: "Failed to save subscription" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Subscribed successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error in leads subscribe:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
