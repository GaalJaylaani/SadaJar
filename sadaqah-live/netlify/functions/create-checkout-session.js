import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, roomId, displayName, isAnonymous, pledgeOnly, campaignName } = JSON.parse(event.body);

    const origin = event.headers.origin
      ?? (event.headers.host?.startsWith('localhost')
        ? `http://${event.headers.host}`
        : `https://${event.headers.host}`);

    const params = new URLSearchParams({
      amount: String(amount),
      displayName,
      isAnonymous: String(isAnonymous),
      pledgeOnly: String(pledgeOnly),
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: campaignName || 'Sadaqah Donation',
              description: isAnonymous ? 'Anonymous gift' : `Gift from ${displayName}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/room/${roomId}/success?${params.toString()}`,
      cancel_url: `${origin}/room/${roomId}/niyyah`,
      metadata: { roomId, displayName, isAnonymous: String(isAnonymous), pledgeOnly: String(pledgeOnly) },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
