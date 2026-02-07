// Apple Music Platform Integration
// V0 Status: Partial Support (Source Only)

// INTERNAL NOTE:
// Without Apple Developer Program ($99/year), we CANNOT:
// - Create playlists in Apple Music
// - Add tracks to Apple Music playlists
// - Use server-to-server API

// V0 CAPABILITIES (0€ budget):
// - Source only: Read user's library (via MusicKit JS client-side)
// - Export: CSV/TXT export of playlists
// - Transfer out: Read from Apple Music, match to other platforms, write there
// 
// We do NOT promise "Full sync to Apple Music" in V0.
// Public copy: "Partial support (export/transfer out). Full sync coming soon based on demand."

// UPGRADE PATH:
// When Apple Developer Program is paid AND there's user demand:
// 1. Implement server-side JWT token generation
// 2. Enable playlist creation via Apple Music API
// 3. Update capability matrix to "Full Support"

export const APPLE_MUSIC_INTERNAL = {
  v0Status: "partial_source_only",
  canRead: true,
  canWrite: false,
  canExport: true,
  requiresDevProgram: true,
  devProgramCost: "$99/year",
  upgradeTrigger: "user_demand", // Not a number, based on leads/feedback
}

export type AppleMusicMode = "musickit" | "manual_import"

// Check if we can use MusicKit (client-side only, requires user interaction)
export function getAppleMusicMode(): AppleMusicMode {
  // V0: Without Apple Dev Program server cert, we can only use:
  // 1. Client-side MusicKit JS (limited, user must be subscribed to Apple Music)
  // 2. Manual import (CSV/TXT upload) as fallback
  
  // Check if we have server-side credentials
  if (process.env.APPLE_DEVELOPER_TOKEN) {
    return "musickit"
  }
  
  // Fallback to manual import for V0 (0€ mode)
  return "manual_import"
}

// Client-side only: Initialize MusicKit
export async function initMusicKit() {
  if (typeof window === "undefined") return null
  
  // @ts-ignore
  if (!window.MusicKit) {
    await loadMusicKitScript()
  }
  
  // @ts-ignore
  return window.MusicKit.configure({
    developerToken: process.env.NEXT_PUBLIC_APPLE_DEVELOPER_TOKEN,
    app: {
      name: "PlaylistCoPilot",
      buildVersion: "1.0",
    },
  })
}

function loadMusicKitScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("musickit-script")) {
      resolve()
      return
    }
    
    const script = document.createElement("script")
    script.id = "musickit-script"
    script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js"
    script.onload = () => resolve()
    script.onerror = () => reject()
    document.head.appendChild(script)
  })
}

// Export for manual import fallback
export function exportToCSV(tracks: any[]): string {
  const headers = ["Title", "Artist", "Album", "ISRC"]
  const rows = tracks.map(t => [
    t.attributes?.name || "",
    t.attributes?.artistName || "",
    t.attributes?.albumName || "",
    t.attributes?.isrc || "",
  ])
  
  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
}

export function exportToTXT(tracks: any[]): string {
  return tracks.map(t => 
    `${t.attributes?.name} - ${t.attributes?.artistName}`
  ).join("\n")
}
