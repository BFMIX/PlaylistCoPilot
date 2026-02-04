import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Music, RefreshCw, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your playlists, everywhere.
          </h1>
          <p className="mt-6 text-2xl text-gray-600">
            Sync for the price of a coffee. ☕
          </p>
          <p className="mt-2 text-lg text-gray-500">
            Transfer between Spotify, Apple Music, Deezer and YouTube.
            <br />
            $1.99/month. 1 month free. No credit card required.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/supported-services">
              <Button size="lg" variant="outline" className="text-lg px-8">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Trusted by early users • Official APIs only • No scraping
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">One-click sync</h3>
              <p className="mt-2 text-gray-600">
                Transfer hundreds of songs in seconds, not hours.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">4 platforms</h3>
              <p className="mt-2 text-gray-600">
                Spotify, Apple Music, Deezer, YouTube. More coming.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Official APIs only</h3>
              <p className="mt-2 text-gray-600">
                We use official APIs. No hacks, no scraping, no risk.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing teaser */}
      <div className="py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold">Simple pricing</h2>
          <p className="mt-4 text-gray-600">
            Why pay $5/month elsewhere? We keep it lean and pass the savings to you.
          </p>
          <div className="mt-8 inline-flex items-center gap-4 bg-gray-100 rounded-full px-6 py-3">
            <span className="text-gray-500 line-through">Competitors: $4.99/mo</span>
            <span className="text-2xl font-bold text-green-600">Us: $1.99/mo</span>
          </div>
          <div className="mt-8">
            <Link href="/pricing">
              <Button size="lg" variant="outline">View all plans</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/supported-services" className="hover:text-white">Supported Services</Link></li>
                <li><Link href="/feedback" className="hover:text-white">Feedback</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
            <div className="col-span-2">
              <h4 className="text-white font-semibold mb-4">SyncTune</h4>
              <p className="text-sm">
                Not affiliated with Spotify, Apple Music, Deezer or YouTube.
                All trademarks belong to their respective owners.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
