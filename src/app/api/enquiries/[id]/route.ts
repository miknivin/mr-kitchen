import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { isAdminUser } from "@/lib/auth";

// Get single enquiry (Admin only)
export async function GET(
    _request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        await isAdminUser();

        const { id } = await context.params;
        const enquiry = await Enquiry.findById(id);

        if (!enquiry) {
            return NextResponse.json(
                { success: false, message: "Enquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, enquiry }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Update enquiry status (Admin only)
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        await isAdminUser();

        const { id } = await context.params;
        const body = await request.json();

        const enquiry = await Enquiry.findByIdAndUpdate(id, body, { new: true });

        if (!enquiry) {
            return NextResponse.json(
                { success: false, message: "Enquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, enquiry }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
