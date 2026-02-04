// Deezer API integration
// Docs: https://developers.deezer.com/api

const DEEZER_API_BASE = "https://api.deezer.com"

export interface DeezerTrack {
  id: string
  title: string
  artist: { name: string }
  album: { title: string }
  duration: number
  isrc?: string
}

export async function getDeezerUserPlaylists(accessToken: string) {
  const response = await fetch(`${DEEZER_API_BASE}/user/me/playlists?access_token=${accessToken}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch playlists")
  }

  const data = await response.json()
  return data.data
}

export async function getDeezerPlaylistTracks(playlistId: string, accessToken: string) {
  const response = await fetch(
    `${DEEZER_API_BASE}/playlist/${playlistId}/tracks?access_token=${accessToken}&limit=2000`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch tracks")
  }

  const data = await response.json()
  return data.data as DeezerTrack[]
}

export async function createDeezerPlaylist(
  accessToken: string,
  title: string,
  userId?: string
) {
  // Note: Deezer requires user_id in URL for playlist creation
  const meResponse = await fetch(`${DEEZER_API_BASE}/user/me?access_token=${accessToken}`)
  const me = await meResponse.json()
  
  const response = await fetch(
    `${DEEZER_API_BASE}/user/${me.id}/playlists?access_token=${accessToken}&title=${encodeURIComponent(title)}`,
    { method: "POST" }
  )

  if (!response.ok) {
    throw new Error("Failed to create playlist")
  }

  return response.json()
}

export async function addTracksToDeezerPlaylist(
  playlistId: string,
  trackIds: string[],
  accessToken: string
) {
  // Deezer allows adding tracks via comma-separated IDs
  const chunks = []
  for (let i = 0; i < trackIds.length; i += 50) {
    chunks.push(trackIds.slice(i, i + 50))
  }

  for (const chunk of chunks) {
    const songs = chunk.join(",")
    const response = await fetch(
      `${DEEZER_API_BASE}/playlist/${playlistId}/tracks?access_token=${accessToken}&songs=${songs}`,
      { method: "POST" }
    )

    if (!response.ok) {
      throw new Error("Failed to add tracks")
    }
  }
}

export async function searchDeezerTrack(query: string, accessToken: string) {
  const response = await fetch(
    `${DEEZER_API_BASE}/search/track?q=${encodeURIComponent(query)}&access_token=${accessToken}&limit=5`
  )
  
  if (!response.ok) {
    throw new Error("Search failed")
  }

  const data = await response.json()
  return data.data as DeezerTrack[]
}
