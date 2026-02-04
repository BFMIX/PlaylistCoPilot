import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Get started with playlist syncing",
    features: [
      "1 playlist maximum",
      "Manual sync only",
      "1 AI generation/day",
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/login",
    popular: false,
  },
  {
    name: "Premium",
    price: "$1.99",
    period: "/mo",
    description: "The price of a coffee ☕",
    features: [
      "Unlimited playlists",
      "Auto-sync (daily/weekly)",
      "Unlimited AI generations",
      "Priority support",
      "Export to all formats",
    ],
    cta: "Start 1-Month Free",
    href: "/login?plan=premium",
    popular: true,
  },
  {
    name: "Annual",
    price: "$18",
    period: "/year",
    description: "Save 25% with yearly billing",
    features: [
      "Everything in Premium",
      "2 months free",
      "Early access to new features",
      "VIP support",
    ],
    cta: "Start Free Trial",
    href: "/login?plan=annual",
    popular: false,
  },
  {
    name: "Lifetime",
    price: "$99",
    period: " once",
    description: "Pay once, use forever",
    features: [
      "Everything in Premium",
      "All future updates",
      "Lifetime access",
      "Founder badge",
    ],
    cta: "Buy Lifetime",
    href: "/login?plan=lifetime",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sync for the price of a coffee</h1>
          <p className="text-xl text-gray-600">No hidden fees. Cancel anytime. 1 month free trial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative flex flex-col ${plan.popular ? "border-2 border-blue-500" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="mt-6">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>All plans include access to Spotify, Deezer, and YouTube.</p>
          <p className="mt-2">Apple Music full sync coming soon (currently export-only).</p>
        </div>
      </div>
    </div>
  )
}
