import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const supabase = createClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      if (!userId) break

      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0].price.id

      // Determine plan type from price ID (you'll map these in your config)
      let planType = "premium_monthly"
      // TODO: Map price IDs to plan types

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: priceId,
        plan_type: planType,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_end: subscription.trial_end 
          ? new Date(subscription.trial_end * 1000).toISOString() 
          : null,
      })

      break
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.subscription as string

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("stripe_subscription_id", subscriptionId)
        .single()

      if (sub) {
        await supabase
          .from("subscriptions")
          .update({ status: "active" })
          .eq("id", sub.id)
      }

      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from("subscriptions")
        .update({ 
          status: "canceled",
          plan_type: "free"
        })
        .eq("stripe_subscription_id", subscription.id)

      break
    }
  }

  return NextResponse.json({ received: true })
}
