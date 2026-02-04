"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const platforms = ["spotify", "apple_music", "deezer", "youtube", "tidal", "soundcloud", "other"]

export function FeatureRequestForm() {
  const [type, setType] = useState("feature")
  const [platform, setPlatform] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          platform: platform || null,
          title,
          message,
          email: email || null,
        }),
      })

      if (res.ok) {
        toast({ title: "Thank you for your feedback!" })
        setTitle("")
        setMessage("")
        setPlatform("")
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      toast({ title: "Failed to submit", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border">
      <div>
        <label className="text-sm font-medium mb-2 block">I want to...</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3"
        >
          <option value="feature">Request a feature</option>
          <option value="bug">Report a bug</option>
          <option value="platform_request">Request a new platform</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Platform (optional)</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3"
        >
          <option value="">Select platform...</option>
          {platforms.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short summary"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your request in detail..."
          required
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Email (optional)</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="To follow up on your request"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  )
}
