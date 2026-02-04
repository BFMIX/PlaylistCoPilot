"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { FeatureRequest } from "@/types"

interface Props {
  requests: FeatureRequest[]
}

export function FeatureRequestsList({ requests }: Props) {
  const [voting, setVoting] = useState<string | null>(null)
  const { toast } = useToast()

  const handleVote = async (id: string) => {
    setVoting(id)
    try {
      const res = await fetch(`/api/feedback/${id}/vote`, {
        method: "POST",
      })
      if (res.ok) {
        toast({ title: "Vote recorded!" })
      } else if (res.status === 409) {
        toast({ title: "You already voted for this" })
      } else {
        throw new Error("Failed to vote")
      }
    } catch {
      toast({ title: "Failed to vote", variant: "destructive" })
    } finally {
      setVoting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success"
      case "planned": return "warning"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="border rounded-lg p-4 bg-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{request.title}</h3>
                <Badge variant={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
                {request.platform && (
                  <Badge variant="outline">{request.platform}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{request.message}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{new Date(request.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>{request.votes_count} votes</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(request.id)}
              disabled={voting === request.id || request.user_has_voted}
            >
              {request.user_has_voted ? "✓ Voted" : "▲ Upvote"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
