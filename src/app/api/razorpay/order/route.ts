import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/db";
import { isAuthenticatedUser } from "@/lib/auth";
import SessionStartedOrder from "@/models/SessionStartedOrders";

export async function POST(req: Request) {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    try {
        await dbConnect();

        const user = await isAuthenticatedUser();

        const {
            amount,
            currency = "INR",
            orderItems,
            shippingInfo,
            itemsPrice,
            totalAmount,
            orderNotes,
        } = await req.json();

        if (!amount) {
            return NextResponse.json(
                { success: false, message: "Amount is required" },
                { status: 400 }
            );
        }

        // 1. Create Razorpay order
        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // 2. Save SessionStartedOrder in DB so admin can see it
        //    This is the ONLY record created at this stage — real Order is created after payment success
        if (orderItems && shippingInfo) {
            try {
                await SessionStartedOrder.create({
                    razorpayOrderId: razorpayOrder.id,
                    razorpayPaymentStatus: "created",
                    shippingInfo: {
                        fullName: shippingInfo.fullName || "",
                        address: shippingInfo.address || "",
                        email: shippingInfo.email || "",
                        state: shippingInfo.state || "",
                        city: shippingInfo.city || "",
                        phoneNo: shippingInfo.phoneNo || "",
                        zipCode: shippingInfo.zipCode || "",
                        country: shippingInfo.country || "India",
                    },
                    user: user._id,
                    orderItems: orderItems.map((item: any) => ({
                        name: item.name,
                        quantity: item.quantity,
                        image: item.image || "",
                        price: item.price?.toString() || "0",
                        discountPrice: item.discountPrice || undefined,
                        product: item.product || undefined,
                    })),
                    itemsPrice: itemsPrice || amount,
                    totalAmount: totalAmount || amount,
                    orderNotes: orderNotes || "",
                });
            } catch (sessionErr: any) {
                // Non-blocking — log but don't fail the payment
                console.error("Failed to save SessionStartedOrder:", sessionErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        });
    } catch (error: any) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to create Razorpay order" },
            { status: 500 }
        );
    }
}
