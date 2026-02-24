import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { isAuthenticatedUser, authorizeRoles } from "@/lib/auth";

// Get all products
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1") || 1;
        const limit = parseInt(searchParams.get("limit") || "12") || 12;
        const keyword = searchParams.get("keyword") || "";
        const category = searchParams.get("category") || "";

        const skip = (page - 1) * limit;
        const query: any = {};

        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }

        if (category) {
            query.category = category;
        }

        const allProducts = await Product.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalProducts = await Product.countDocuments(query);

        return NextResponse.json(
            {
                success: true,
                allProducts,
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Create new product (Admin Only)
export async function POST(req: Request) {
    try {
        await dbConnect();

        const user = await isAuthenticatedUser();
        authorizeRoles(user, "admin");

        const body = await req.json();
        const product = await Product.create({
            ...body,
            user: user._id
        });

        return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
