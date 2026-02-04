import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: connections } = await supabase
    .from("connections")
    .select("*")
    .eq("user_id", session?.user.id)

  const { data: playlists } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", session?.user.id)
    .order("created_at", { ascending: false })

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", session?.user.id)
    .single()

  const plan = subscription?.plan_type || "free"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! You have {playlists?.length || 0} playlists synced.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{plan}</div>
            <p className="text-xs text-gray-500 mt-1">
              {plan === "free" ? "Upgrade to unlock more features" : "Active subscription"}
            </p>
            {plan === "free" && (
              <Link href="/pricing">
                <Button className="w-full mt-4" size="sm">Upgrade $1.99</Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Connected Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connections?.length || 0}/4</div>
            <p className="text-xs text-gray-500 mt-1">
              Spotify, Apple Music, Deezer, YouTube
            </p>
            <Link href="/connections">
              <Button variant="outline" className="w-full mt-4" size="sm">
                Manage Connections
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/playlists/new">
              <Button className="w-full" size="sm">+ New Sync</Button>
            </Link>
            <Link href="/supported-services">
              <Button variant="outline" className="w-full" size="sm">
                View Supported Services
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Playlists</h2>
        {playlists && playlists.length > 0 ? (
          <div className="bg-white rounded-lg border">
            {playlists.slice(0, 5).map((playlist) => (
              <div key={playlist.id} className="flex items-center justify-between p-4 border-b last:border-0">
                <div>
                  <p className="font-medium">{playlist.name}</p>
                  <p className="text-sm text-gray-500">
                    {playlist.source_platform} → {playlist.destination_platform}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    playlist.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {playlist.is_active ? "Active" : "Paused"}
                  </span>
                  <Link href={`/playlists/${playlist.id}`}>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-8 text-center">
            <p className="text-gray-500 mb-4">No playlists synced yet</p>
            <Link href="/playlists/new">
              <Button>Create your first sync</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
