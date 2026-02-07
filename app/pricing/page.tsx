"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "",
      description: "Get started with playlist syncing",
      features: [
        "1 playlist",
        "YouTube sync only",
        "Manual sync",
        "Basic support",
      ],
      cta: "Get Started",
      href: "/login",
      popular: false,
    },
    {
      name: "Premium",
      price: isYearly ? "$18" : "$1.99",
      period: isYearly ? "/year" : "/month",
      description: isYearly ? "Save 25% with yearly" : "Flexible monthly plan",
      features: [
        "Unlimited playlists",
        "All platforms (when available)",
        "Auto-sync",
        "Priority support",
        "1 month free trial",
      ],
      cta: "Start Free Trial",
      href: `/login?plan=${isYearly ? 'annual' : 'monthly'}`,
      popular: true,
      badge: isYearly ? "Save 25%" : "Most Popular",
    },
    {
      name: "Lifetime",
      price: "$99",
      period: " one-time",
      description: "Pay once, keep forever",
      features: [
        "Everything in Premium",
        "All future updates",
        "Lifetime access",
        "Founder badge",
      ],
      cta: "Get Lifetime",
      href: "/login?plan=lifetime",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple pricing</h1>
          <p className="text-xl text-gray-600">Start free. Upgrade when you need more.</p>
          
          {/* Toggle */}
          <div className="mt-8 inline-flex items-center bg-white rounded-full p-1 border">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                !isYearly ? "bg-gray-900 text-white" : "text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                isYearly ? "bg-gray-900 text-white" : "text-gray-600"
              }`}
            >
              Yearly
            </button>
          </div>
          {isYearly && (
            <p className="mt-2 text-sm text-green-600 font-medium">Save 25% with yearly billing</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative flex flex-col ${plan.popular ? "border-2 border-gray-900" : ""}`}>
              {plan.popular && plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
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
          <p>All paid plans include a 1-month free trial. No credit card required to start.</p>
          <p className="mt-2">Spotify and Deezer support coming soon.</p>
        </div>
      </div>
    </div>
  )
}
