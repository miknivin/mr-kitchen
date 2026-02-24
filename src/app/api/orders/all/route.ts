import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { isAdminUser } from "@/lib/auth";

// Get all orders (Admin only)
export async function GET() {
    try {
        await dbConnect();

        await isAdminUser();

        const orders = await Order.find({})
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, orders }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
