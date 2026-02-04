import { loadStripe } from '@stripe/stripe-js'

export const getStripe = () => {
  let stripePromise: Promise<any> | null = null

  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }

  return stripePromise
}
