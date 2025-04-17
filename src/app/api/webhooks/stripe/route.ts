import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { sendOrderConfirmation } from '@/lib/emailService';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(stripeSecretKey);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.text();

    // Get the signature from the headers
    const headerList = headers();
    const signature = headerList.get('stripe-signature') || '';

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify the event came from Stripe
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Save the order to your database and send confirmation email
        await handleSuccessfulPayment(session);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${paymentIntent.last_payment_error?.message}`);
        break;
      }
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

/**
 * Handles a successful payment by saving the order and user data
 */
async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    // In a real application, you would:
    // 1. Get the customer information
    // 2. Save the purchase to your database
    // 3. Grant access to purchased content
    // 4. Send confirmation email

    // Extract metadata
    const courseId = session.metadata?.courseId;
    const userId = session.client_reference_id;
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;

    console.log(`Processing successful payment for course ${courseId} by user ${userId || 'guest'} (${customerEmail || 'no email'})`);

    // For demo purposes, we're just logging the purchase
    // In a real app, you would save this to your database
    const purchaseData = {
      userId: userId || 'guest',
      email: customerEmail,
      courseId,
      orderId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      status: 'completed',
      paymentDate: new Date().toISOString(),
    };

    console.log('Purchase recorded:', purchaseData);

    // Handle line items for potentially multiple courses
    if (courseId?.includes(',')) {
      // If there are multiple courses, send a single email with all of them
      await sendOrderConfirmation({
        customerEmail: customerEmail || '',
        customerName: customerName || undefined,
        orderId: session.id,
        orderDate: new Date().toLocaleDateString(),
        totalAmount: session.amount_total || 0,
        currency: session.currency || 'rub',
        courseTitle: session.metadata?.courseBundle || 'Набор курсов',
        courseId: courseId
      });
    } else {
      // For a single course
      // Fetch the full course details here if needed
      const courseName = session.line_items?.data[0]?.description || session.metadata?.courseName || 'Unknown course';

      // Send confirmation email for a single course purchase
      if (customerEmail) {
        await sendOrderConfirmation({
          customerEmail: customerEmail,
          customerName: customerName || undefined,
          orderId: session.id,
          orderDate: new Date().toLocaleDateString(),
          totalAmount: session.amount_total || 0,
          currency: session.currency || 'rub',
          courseTitle: courseName,
          courseId: courseId || 'unknown'
        });

        console.log(`Confirmation email sent to ${customerEmail}`);
      }
    }

  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}
