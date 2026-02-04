// Apple Music API (MusicKit) - V0: Export only
// Docs: https://developer.apple.com/documentation/applemusicapi/

// Note: Full write requires Apple Developer Program ($99/an)
// V0 implementation: Read/Export only using MusicKit JS (client-side)

export interface AppleMusicTrack {
  id: string
  attributes: {
    name: string
    artistName: string
    albumName: string
    durationInMillis: number
    isrc?: string
  }
}

export interface AppleMusicPlaylist {
  id: string
  attributes: {
    name: string
    description?: string
    trackCount: number
  }
}

// Server-side functions require Developer Token (JWT)
// Client-side functions require User Token (from MusicKit JS)

export async function getAppleMusicUserPlaylists(
  developerToken: string,
  userToken: string
) {
  const response = await fetch(
    "https://api.music.apple.com/v1/me/library/playlists",
    {
      headers: {
        Authorization: `Bearer ${developerToken}`,
        "Music-User-Token": userToken,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch Apple Music playlists")
  }

  const data = await response.json()
  return data.data as AppleMusicPlaylist[]
}

export async function getAppleMusicPlaylistTracks(
  playlistId: string,
  developerToken: string,
  userToken: string
) {
  const tracks: AppleMusicTrack[] = []
  let offset = 0
  const limit = 100

  while (true) {
    const response = await fetch(
      `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          "Music-User-Token": userToken,
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch tracks")
    }

    const data = await response.json()
    tracks.push(...data.data)

    if (data.data.length < limit) break
    offset += limit
  }

  return tracks
}

// Note: Write operations (create playlist, add tracks) require:
// 1. Apple Developer Program membership ($99/year)
// 2. Special entitlements from Apple (write access is restricted)
// These are NOT available in V0 (0€ mode)

export const APPLE_MUSIC_NOTE = {
  v0_status: "export_only",
  v0_capabilities: ["Read library", "Export playlists", "Transfer to other platforms"],
  v1_requirements: [
    "Apple Developer Program ($99/year)",
    "MusicKit server-side implementation",
    "User authorization via MusicKit JS",
  ],
  roadmap: "Full sync available at 100 lead requests",
}
