import { Metadata } from "next"
import { LeadCaptureForm } from "@/components/leads/lead-capture-form"
import { Check, X, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Supported Services - SyncTune",
}

const capabilities = [
  {
    id: "spotify",
    name: "Spotify",
    icon: "🟢",
    source_oauth: true,
    source_public: false,
    destination_write: true,
    modes: ["add_only", "export"],
    badge: "full" as const,
    limitations: "Rate limit variable + rolling window. Gestion 429 Retry-After obligatoire.",
  },
  {
    id: "apple_music",
    name: "Apple Music",
    icon: "🍎",
    source_oauth: true,
    source_public: false,
    destination_write: false,
    modes: ["export_only"],
    badge: "partial" as const,
    limitations: "V0: Export + transfert sortant uniquement. Full write à 100 leads.",
  },
  {
    id: "deezer",
    name: "Deezer",
    icon: "🎵",
    source_oauth: true,
    source_public: true,
    destination_write: true,
    modes: ["add_only", "export"],
    badge: "full" as const,
    limitations: "API stable, quotas généreux.",
  },
  {
    id: "youtube",
    name: "YouTube / YouTube Music",
    icon: "📺",
    source_oauth: true,
    source_public: true,
    destination_write: true,
    modes: ["add_only", "export"],
    badge: "full" as const,
    limitations: "YT Music via playlists YouTube (pas d'API dédiée). 10k quota/jour.",
  },
]

export default function SupportedServicesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Supported Music Services</h1>
        <p className="text-lg text-gray-600 mt-2">
          We use official APIs only. No scraping.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-sm">Full Support</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="text-sm">Supported (Partial)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-300"></span>
          <span className="text-sm">Coming Soon</span>
        </div>
      </div>

      {/* Capability Matrix */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Service</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Source (OAuth)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Source (Public)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Destination Write</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Modes</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Limitations</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {capabilities.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{service.icon}</span>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        {service.badge === "full" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Full Support
                          </span>
                        )}
                        {service.badge === "partial" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Partial
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {service.source_oauth ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {service.source_public ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {service.destination_write ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        Soon
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {service.modes.join(", ")}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                    {service.limitations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apple Music CTA */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 text-lg">
              🍎 Apple Music Full Sync — Coming Soon
            </h3>
            <p className="text-orange-800 mt-2">
              Currently supported: Export playlists and transfer to Spotify/Deezer.
              Full two-way sync (create playlists in Apple Music) launching at 100 requests.
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-200 text-orange-900">
                0/100 requests
              </span>
            </div>
          </div>
          <div className="md:w-80">
            <LeadCaptureForm
              source="apple_music_cta"
              ctaText="Get Notified"
              headline={undefined}
              subheadline="Be the first to know when full Apple Music sync is available."
              tags={["apple_music_full"]}
            />
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note on YouTube Music:</strong> We use the official YouTube Data API. 
          Playlists created on YouTube automatically appear in YouTube Music. 
          There is no separate "YouTube Music API" — this is the official method.
        </p>
      </div>
    </div>
  )
}
