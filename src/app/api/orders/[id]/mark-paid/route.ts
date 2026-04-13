import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const { paymentId } = await req.json();

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        // Only update if not already paid
        if (order.paymentInfo?.status !== "Paid") {
            order.paymentInfo = {
                id: paymentId,
                status: "Paid",
            };
            await order.save();
        }

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error("Mark Paid Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
