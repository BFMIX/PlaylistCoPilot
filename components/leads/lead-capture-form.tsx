"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface LeadCaptureFormProps {
  source: string
  ctaText?: string
  headline?: string
  subheadline?: string
  tags?: string[]
  onSuccess?: () => void
}

export function LeadCaptureForm({
  source,
  ctaText = "Get Notified",
  headline,
  subheadline,
  tags = [],
  onSuccess,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/leads/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          tags,
          locale: navigator.language,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        onSuccess?.()
        toast({
          title: "You're on the list!",
          description: "We'll email you when this feature is available.",
        })
      } else {
        throw new Error("Failed to subscribe")
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
        <p className="font-medium">✅ You're on the list!</p>
        <p className="text-sm mt-1">We'll email you as soon as this is ready.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {headline && <h4 className="font-semibold text-lg">{headline}</h4>}
      {subheadline && <p className="text-sm text-muted-foreground">{subheadline}</p>}
      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "..." : ctaText}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
    </form>
  )
}
