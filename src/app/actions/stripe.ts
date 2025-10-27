
'use server';

import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebase } from '@/firebase/server';

// Ensure the secret key is provided. Throw an error at startup if not set.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set in the environment variables.');
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-06-20',
    typescript: true,
});

export async function createCheckoutSession(userId: string) {
    // Ensure the price ID is provided.
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
        throw new Error('Stripe Price ID (STRIPE_PRICE_ID) is not configured in the environment variables.');
    }
    
    const headersList = headers();
    const origin = headersList.get('origin');

    if (!origin) {
        // This is a fallback for safety, though 'origin' should typically be present.
        throw new Error('Could not determine the request origin. The checkout session cannot be created without it.');
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/subscriptions`,
            // Pass the user's ID to the checkout session
            client_reference_id: userId,
        });

        // The session URL should always be present on successful creation.
        if (!session.url) {
            throw new Error("Stripe session created successfully, but no URL was returned.");
        }

        return { url: session.url };
    } catch (error: any) {
        // Log the detailed error on the server for debugging.
        console.error("Error creating Stripe checkout session:", error);

        // Return a user-friendly error message.
        // Avoid leaking detailed Stripe error messages to the client.
        throw new Error("An unexpected error occurred while creating the checkout session. Please try again later.");
    }
}
