import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DISCOUNT_TIERS, type CartItem } from '@/context/CartContext';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(request: Request) {
  try {
    const {
      courseId,
      courseName,
      price,
      quantity = 1,
      userId = 'guest',
      userEmail,
      items = [] as CartItem[], // Cart items for multiple purchases
      totalQuantity = 0 // Total items in cart for discount calculation
    } = await request.json();

    // Validate required parameters
    if ((!courseId || !courseName || !price) && items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Prepare Stripe checkout session parameters
    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      metadata: {
        courseId: '',
      },
      client_reference_id: userId,
    };

    // Handle multiple items from cart (with potential discounts)
    if (items.length > 0) {
      // Calculate applicable discount
      let discountPercentage = 0;
      if (totalQuantity) {
        const applicableDiscount = DISCOUNT_TIERS
          .filter(tier => totalQuantity >= tier.threshold)
          .sort((a, b) => b.threshold - a.threshold)[0];

        if (applicableDiscount) {
          discountPercentage = applicableDiscount.percentage;
          params.metadata = {
            ...params.metadata,
            discount: `${discountPercentage}%`,
            discount_description: applicableDiscount.description
          };
        }
      }

      // Add line items from cart
      params.line_items = items.map((item: CartItem) => ({
        price_data: {
          currency: 'rub',
          product_data: {
            name: item.title,
            metadata: {
              courseId: item.courseId,
            },
          },
          unit_amount: item.discountedPrice
            ? Math.round(item.discountedPrice * 100)
            : Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Store concatenated course IDs for multi-purchase
      const courseIds = items.map((item: CartItem) => item.courseId).join(',');
      params.metadata = {
        ...params.metadata,
        courseId: courseIds,
        courseBundle: `Пакет из ${items.length} курсов`
      };
    }
    // Handle single course purchase
    else {
      // Convert price to cents/smallest currency unit as required by Stripe
      const amount = Math.round(price * 100);

      params.line_items = [
        {
          price_data: {
            currency: 'rub',
            product_data: {
              name: courseName,
              metadata: {
                courseId,
              },
            },
            unit_amount: amount,
          },
          quantity,
        },
      ];

      if (params.metadata) {
        params.metadata.courseId = courseId;
      }
    }

    // Add customer email if available
    if (userEmail) {
      params.customer_email = userEmail;
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
