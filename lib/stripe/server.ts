import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const getOrCreateCustomer = async (userId: string, email: string) => {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = createClient()

  // Check existing subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  if (subscription?.stripe_customer_id) {
    return subscription.stripe_customer_id
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })

  return customer.id
}

export const createCheckoutSession = async ({
  customerId,
  priceId,
  userId,
}: {
  customerId: string
  priceId: string
  userId: string
}) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    subscription_data: {
      trial_period_days: 30,
      metadata: {
        userId,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
  })

  return session
}
