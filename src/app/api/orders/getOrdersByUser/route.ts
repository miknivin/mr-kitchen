import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { isAuthenticatedUser } from "@/lib/auth";

export async function GET() {
    try {
        await dbConnect();

        const user = await isAuthenticatedUser();

        const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, orders }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error", orders: [] },
            { status: 500 }
        );
    }
}
