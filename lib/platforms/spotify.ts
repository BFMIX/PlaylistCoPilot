// Spotify Web API integration
// Docs: https://developer.spotify.com/documentation/web-api

const SPOTIFY_API_BASE = "https://api.spotify.com/v1"

export interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: { name: string }
  duration_ms: number
  isrc?: string
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description: string | null
  tracks: { total: number }
  owner: { id: string }
}

export async function refreshSpotifyToken(refreshToken: string) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to refresh token")
  }

  return response.json()
}

export async function getSpotifyUserPlaylists(accessToken: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}/me/playbooks?limit=50`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After")
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`)
    }
    throw new Error("Failed to fetch playlists")
  }

  const data = await response.json()
  return data.items as SpotifyPlaylist[]
}

export async function getSpotifyPlaylistTracks(
  accessToken: string,
  playlistId: string
): Promise<SpotifyTrack[]> {
  const tracks: SpotifyTrack[] = []
  let url = `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks?fields=items(track(id,name,artists(name),album(name),duration_ms,external_ids(isrc)))&limit=100`

  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("Retry-After") || "1")
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000))
        continue
      }
      throw new Error("Failed to fetch tracks")
    }

    const data = await response.json()
    tracks.push(
      ...data.items
        .filter((item: any) => item.track)
        .map((item: any) => ({
          ...item.track,
          isrc: item.track.external_ids?.isrc,
        }))
    )

    url = data.next
  }

  return tracks
}

export async function createSpotifyPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description?: string
) {
  const response = await fetch(`${SPOTIFY_API_BASE}/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description: description || "Created with SyncTune",
      public: false,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create playlist")
  }

  return response.json()
}

export async function addTracksToSpotifyPlaylist(
  accessToken: string,
  playlistId: string,
  trackUris: string[]
) {
  // Spotify allows max 100 tracks per request
  const chunks = []
  for (let i = 0; i < trackUris.length; i += 100) {
    chunks.push(trackUris.slice(i, i + 100))
  }

  for (const chunk of chunks) {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: chunk }),
      }
    )

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("Retry-After") || "1")
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000))
        // Retry once
        await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: chunk }),
        })
      } else {
        throw new Error("Failed to add tracks")
      }
    }
  }
}

export async function searchSpotifyTrack(
  accessToken: string,
  query: string,
  limit: number = 5
) {
  const response = await fetch(
    `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )

  if (!response.ok) {
    throw new Error("Search failed")
  }

  const data = await response.json()
  return data.tracks.items as SpotifyTrack[]
}
