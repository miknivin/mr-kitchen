import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ message: "Signature missing" }, { status: 400 });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(body);

        // Handle payment.captured or order.paid
        if (event.event === "payment.captured" || event.event === "order.paid") {
            const payment = event.payload.payment.entity;
            const dbOrderId = payment.notes?.db_order_id;

            if (dbOrderId) {
                await dbConnect();
                const order = await Order.findById(dbOrderId);

                if (order && order.paymentInfo?.status !== "Paid") {
                    order.paymentInfo = {
                        id: payment.id,
                        status: "Paid",
                    };
                    await order.save();
                    console.log(`Order ${dbOrderId} marked as Paid via Webhook`);
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
