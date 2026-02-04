import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { hashIp } from "@/lib/utils"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const featureId = params.id
    const supabase = createClient()

    // Get user if authenticated
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null

    // Get IP for anonymous voting
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const ipHash = await hashIp(ip)

    // Check if already voted
    let existingVote = null

    if (userId) {
      const { data } = await supabase
        .from("feature_votes")
        .select("id")
        .eq("feature_request_id", featureId)
        .eq("user_id", userId)
        .single()
      existingVote = data
    } else {
      const { data } = await supabase
        .from("feature_votes")
        .select("id")
        .eq("feature_request_id", featureId)
        .eq("ip_hash", ipHash)
        .single()
      existingVote = data
    }

    if (existingVote) {
      return NextResponse.json(
        { error: "Already voted" },
        { status: 409 }
      )
    }

    // Insert vote using RPC for atomic increment
    const { error } = await supabase.rpc("upvote_feature", {
      feature_id: featureId,
      voter_user_id: userId,
      voter_ip_hash: ipHash,
    })

    if (error) {
      console.error("Error voting:", error)
      return NextResponse.json(
        { error: "Failed to record vote" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in vote:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
