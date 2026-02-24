import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { isAuthenticatedUser } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const user = await isAuthenticatedUser();

        const {
            orderItems,
            shippingInfo,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
            paymentMethod,
            paymentInfo,
            couponApplied,
            couponDiscount,
            orderNotes,
        } = await req.json();

        const order = await Order.create({
            orderItems,
            shippingInfo,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
            paymentMethod,
            paymentInfo,
            couponApplied,
            couponDiscount,
            orderNotes,
            user: user._id,
        });

        return NextResponse.json({ success: true, order }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
