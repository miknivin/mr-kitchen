import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { isAuthenticatedUser, authorizeRoles } from "@/lib/auth";

// Get single product details
export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const productById = await Product.findById(id).populate("reviews.user", "name email");

        if (!productById) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, productById }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Update product details (Admin Only)
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const user = await isAuthenticatedUser();
        authorizeRoles(user, "admin");

        const { id } = await context.params;
        const body = await req.json();

        const product = await Product.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, product }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Delete product (Admin Only)
export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const user = await isAuthenticatedUser();
        authorizeRoles(user, "admin");

        const { id } = await context.params;
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        await product.deleteOne();

        return NextResponse.json(
            { success: true, message: "Product deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
