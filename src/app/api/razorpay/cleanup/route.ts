import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SessionStartedOrder from "@/models/SessionStartedOrders";

export async function DELETE(req: Request) {
    try {
        await dbConnect();

        const { razorpayOrderId } = await req.json();

        if (!razorpayOrderId) {
            return NextResponse.json(
                { success: false, message: "razorpayOrderId is required" },
                { status: 400 }
            );
        }

        await SessionStartedOrder.findOneAndDelete({ razorpayOrderId });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        // Non-critical — log and return success anyway so payment flow isn't affected
        console.error("Session cleanup error:", error.message);
        return NextResponse.json({ success: true });
    }
}
