import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-bold text-xl">
              SyncTune
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/playlists" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Playlists
              </Link>
              <Link href="/connections" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Connections
              </Link>
              <Link href="/supported-services" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Services
              </Link>
              <Link href="/feedback" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Feedback
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {profile?.email}
            </span>
            <form action="/api/auth/signout" method="post">
              <Button variant="outline" size="sm" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
