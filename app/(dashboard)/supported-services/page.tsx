import { Metadata } from "next"
import { LeadCaptureForm } from "@/components/leads/lead-capture-form"
import { Check, Clock, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Supported Services - PlaylistCoPilot",
}

const capabilities = [
  {
    id: "youtube",
    name: "YouTube",
    icon: "📺",
    source: true,
    destination: true,
    badge: "full" as const,
    description: "Full support. Sync your video playlists now.",
  },
  {
    id: "youtube_music",
    name: "YouTube Music",
    icon: "🎧",
    source: true,
    destination: false,
    badge: "partial" as const,
    description: "Supported indirectly via YouTube playlists. No native API available.",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "🟢",
    source: false,
    destination: false,
    badge: "coming_soon" as const,
    description: "Coming soon. Waiting for Spotify app approval.",
  },
  {
    id: "deezer",
    name: "Deezer",
    icon: "🎵",
    source: false,
    destination: false,
    badge: "coming_soon" as const,
    description: "Coming soon. Waiting for Deezer app approval.",
  },
  {
    id: "apple_music",
    name: "Apple Music",
    icon: "🍎",
    source: true,
    destination: false,
    badge: "partial" as const,
    description: "Partial support (export/transfer out). Full sync coming soon based on demand.",
  },
]

export default function SupportedServicesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Supported Music Services</h1>
        <p className="text-lg text-gray-600 mt-2">
          Keep your playlists in sync across platforms.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Full Support</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span>Partial Support</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-300"></span>
          <span>Coming Soon</span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {capabilities.map((service) => (
          <div 
            key={service.id} 
            className={`p-6 rounded-lg border ${
              service.badge === "full" ? "bg-green-50 border-green-200" :
              service.badge === "partial" ? "bg-yellow-50 border-yellow-200" :
              "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    service.badge === "full" ? "bg-green-200 text-green-800" :
                    service.badge === "partial" ? "bg-yellow-200 text-yellow-800" :
                    "bg-gray-200 text-gray-700"
                  }`}>
                    {service.badge === "full" ? "Full Support" :
                     service.badge === "partial" ? "Partial Support" :
                     "Coming Soon"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-xs">Read</span>
                  {service.source ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-xs">Write</span>
                  {service.destination ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : service.badge === "coming_soon" ? (
                    <Clock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Apple Music CTA */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 text-lg">
              🍎 Want full Apple Music support?
            </h3>
            <p className="text-orange-800 mt-2">
              We are working on full two-way sync for Apple Music. 
              Get notified when it is ready.
            </p>
          </div>
          <div className="md:w-80">
            <LeadCaptureForm
              source="apple_music_cta"
              ctaText="Notify Me"
              subheadline="Be the first to know when Apple Music full sync launches."
              tags={["apple_music_full"]}
            />
          </div>
        </div>
      </div>

      {/* YouTube Music Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>About YouTube Music:</strong> YouTube Music does not have a public API for music catalog. 
          We support it indirectly via YouTube playlists (which automatically appear in your YouTube Music app).
        </p>
      </div>
    </div>
  )
}
