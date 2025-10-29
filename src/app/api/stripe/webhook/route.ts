
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { initializeFirebase } from '@/firebase/server';
import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';

// Ensure Stripe secret key is set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
}
const stripe = new Stripe(stripeSecretKey);

// Ensure webhook secret is set
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables.');
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Initialize Firebase Admin on the server inside the handler
  const { firestore } = initializeFirebase();
  const subscriptionsCollection = collection(firestore, 'subscriptions');

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // We need the user ID. This is a critical part.
      // For this to work, we must pass the user's ID to the checkout session.
      // We will assume it's in client_reference_id for now.
      const userId = session.client_reference_id;
      if (!userId) {
          console.error("Webhook Error: No client_reference_id in checkout session.");
          // Return a 200 to Stripe so it doesn't retry, but log the error.
          return NextResponse.json({ received: true });
      }

      if (!session.subscription || !session.customer) {
        console.error('Webhook Error: checkout.session.completed event is missing subscription or customer ID.');
        return NextResponse.json({ received: true });
      }

      try {
        const subscription = await stripe.subscriptions.retrieve(session.subscription.toString());
        
        const subscriptionData = {
          userId: userId,
          stripeCustomerId: session.customer.toString(),
          stripeSubscriptionId: session.subscription.toString(),
          stripePriceId: subscription.items.data[0]?.price.id || '',
          status: subscription.status,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await addDoc(subscriptionsCollection, subscriptionData);
        console.log(`Successfully created subscription for user ${userId}`);

      } catch (dbError) {
        console.error("Firestore Error: Could not create subscription record.", dbError);
        // If this fails, we need to handle it, but for now we'll log it.
        // Returning 500 would cause Stripe to retry.
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        // This is more advanced. We would need to find the existing document
        // by stripeSubscriptionId and update its status. We'll skip this for now
        // to keep it simple, but this is where you would handle cancellations.
        console.log(`Received subscription update/delete event: ${subscription.id}`);
        break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
