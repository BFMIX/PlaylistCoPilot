// YouTube Data API v3 integration
// Docs: https://developers.google.com/youtube/v3

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

export interface YouTubeVideo {
  id: string
  snippet: {
    title: string
    channelTitle: string
  }
  contentDetails?: {
    duration: string
  }
}

export async function getYouTubePlaylistItems(
  playlistId: string,
  apiKey: string,
  accessToken?: string
) {
  const videos: YouTubeVideo[] = []
  let pageToken: string | null = null

  const headers: HeadersInit = {}
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  do {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      playlistId: playlistId,
      maxResults: "50",
      key: apiKey,
    })

    if (pageToken) {
      params.set("pageToken", pageToken)
    }

    const response = await fetch(`${YOUTUBE_API_BASE}/playlistItems?${params}`, {
      headers,
    })

    if (!response.ok) {
      if (response.status === 403) {
        const error = await response.json()
        if (error.error?.errors?.[0]?.reason === "quotaExceeded") {
          throw new Error("YouTube API quota exceeded")
        }
      }
      throw new Error("Failed to fetch playlist")
    }

    const data = await response.json()
    videos.push(...data.items)
    pageToken = data.nextPageToken || null
  } while (pageToken)

  return videos
}

export async function createYouTubePlaylist(
  accessToken: string,
  title: string,
  description?: string
) {
  const response = await fetch(`${YOUTUBE_API_BASE}/playlists?part=snippet,status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      snippet: {
        title,
        description: description || "Created with SyncTune",
      },
      status: {
        privacyStatus: "private",
      },
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create playlist")
  }

  return response.json()
}

export async function addVideoToYouTubePlaylist(
  accessToken: string,
  playlistId: string,
  videoId: string
) {
  const response = await fetch(`${YOUTUBE_API_BASE}/playlistItems?part=snippet`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      snippet: {
        playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId,
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to add video to playlist")
  }

  return response.json()
}

export async function searchYouTubeVideo(
  apiKey: string,
  query: string,
  accessToken?: string
) {
  const headers: HeadersInit = {}
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(
    `${YOUTUBE_API_BASE}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=5`,
    { headers }
  )

  if (!response.ok) {
    throw new Error("Search failed")
  }

  return response.json()
}
