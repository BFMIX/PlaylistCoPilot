import { NextResponse } from "next/server"

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const playlistId = searchParams.get("playlistId")

  if (!playlistId) {
    return NextResponse.json(
      { error: "Playlist ID required" },
      { status: 400 }
    )
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}`
    )

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Playlist not found or private" },
          { status: 404 }
        )
      }
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()

    const tracks = data.items.map((item: any) => ({
      id: item.contentDetails?.videoId,
      title: item.snippet?.title,
      artist: item.snippet?.videoOwnerChannelTitle || "Unknown",
      thumbnail: item.snippet?.thumbnails?.default?.url,
    }))

    return NextResponse.json({ 
      tracks,
      total: data.pageInfo?.totalResults || tracks.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch playlist" },
      { status: 500 }
    )
  }
}
