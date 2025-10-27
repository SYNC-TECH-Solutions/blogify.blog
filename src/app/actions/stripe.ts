
'use server';

import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-06-20',
});

export async function createCheckoutSession() {
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
        throw new Error('Stripe Price ID is not configured in the environment variables.');
    }
    
    const headersList = headers();
    const origin = headersList.get('origin');

    if (!origin) {
        throw new Error('Could not determine request origin.');
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
        });

        return { url: session.url };
    } catch (error: any) {
        console.error("Error creating Stripe checkout session:", error);
        throw new Error(error.message || "Failed to create Stripe session.");
    }
}
