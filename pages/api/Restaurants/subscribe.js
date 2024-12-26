import Stripe from "stripe";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, userId, name, password, address, number, option, image } =
      req.body;

    try {
      // Step 1: Create Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "pkr",
              product_data: {
                name: "Restaurant Subscription",
              },
              unit_amount: 5000 * 100, // 5000 PKR in the smallest currency unit
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/Login?paymentSuccess=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/Restaurants/Signup?paymentFailed=true`,
        metadata: { userId },
      });

      // Return the session ID for Stripe Checkout
      if (session) {
        res.status(200).json({ url: session.url }); // Send the Stripe Checkout URL
      } else {
        res.status(400).json({ error: "Session creation failed" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Payment session creation failed" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
