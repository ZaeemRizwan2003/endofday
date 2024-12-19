import Order from "@/models/Order";
import Stripe from "stripe";
import User from "@/models/CustomerUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { items, totalAmount, userId, addressId } = req.body;

    try {
      // Find user and address
      const user = await User.findById(userId);
      const selectedAddress = user?.addresses.id(addressId);
      if (!selectedAddress) {
        return res.status(400).json({ error: "Address not found" });
      }

      // Create new order in the database
      const newOrder = await Order.create({
        userId,
        items,
        totalAmount,
        address: selectedAddress,
        status: "pending",
        contact: req.body.contact,
      });

      const deliveryFee = 150;

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          ...items.map((item) => ({
            price_data: {
              currency: "pkr",
              product_data: {
                name: item.title,
              },
              unit_amount: item.price * 100, // Convert to smallest currency unit
            },
            quantity: item.quantity,
          })),
          {
            price_data: {
              currency: "pkr",
              product_data: {
                name: "Delivery Fee",
              },
              unit_amount: deliveryFee * 100, // Convert to smallest currency unit
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/Customer/OrderConfirm?id=${newOrder._id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/Customer/Cdashboard`,
        metadata: { userId, addressId, totalAmount: totalAmount + deliveryFee },
      });
      // Send response with session ID and order ID
      http: res.status(200).json({ id: session.id, orderId: newOrder._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Payment creation failed" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
