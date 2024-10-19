import dbConnect from "@/middleware/mongoose";
import { deliveryPartnersSchema } from "@/models/DeliveryPartner";
import { NextResponse } from "next/server";

export async function POST(request) {
  const payload = await request.json();
  await dbConnect();

  const { mobile, password } = payload;

  const result = await deliveryPartnersSchema.findOne({ contact: mobile });
  let success = false;

  if (result) {
    const isMatch = await bcrypt.compare(password, result.password); // Compare hashed password
    if (isMatch) {
      success = true;
      return NextResponse.json({ result, success });
    }
  }

  return NextResponse.json({
    success: false,
    message: "Invalid mobile number or password.",
  });
}
