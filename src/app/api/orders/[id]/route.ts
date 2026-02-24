import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { isAuthenticatedUser, isAdminUser } from "@/lib/auth";

// Get single order (owner or admin)
export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await context.params;
        const user = await isAuthenticatedUser();

        const order = await Order.findById(id).lean();

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        // Only the order owner or an admin can view it
        if (order.user.toString() !== user._id.toString() && user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Not authorized to view this order" },
                { status: 403 }
            );
        }

        return NextResponse.json({ success: true, order }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Update order status (Admin only)
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await context.params;
        await isAdminUser();

        const body = await req.json();
        const order = await Order.findByIdAndUpdate(id, body, { new: true });

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, order }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
