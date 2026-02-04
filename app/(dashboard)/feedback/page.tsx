import { createClient } from "@/lib/supabase/server"
import { FeatureRequestForm } from "@/components/feedback/feature-request-form"
import { FeatureRequestsList } from "@/components/feedback/feature-requests-list"

export default async function FeedbackPage() {
  const supabase = createClient()

  // Fetch existing feature requests
  const { data: requests } = await supabase
    .from("feature_requests")
    .select("*")
    .order("votes_count", { ascending: false })
    .limit(20)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Help us improve</h1>
        <p className="text-gray-600 mt-2">
          Vote on upcoming features or submit your own ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Submit a Request</h2>
          <FeatureRequestForm />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Existing Requests</h2>
          {requests && requests.length > 0 ? (
            <FeatureRequestsList requests={requests} />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">No requests yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
