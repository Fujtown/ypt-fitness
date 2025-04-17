import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Missing Stripe publishable key');
      return Promise.reject(new Error('Missing Stripe publishable key'));
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};
