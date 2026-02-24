import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { isAuthenticatedUser, authorizeRoles } from "@/lib/auth";

// Get all enquiries (Admin only)
export async function GET() {
    try {
        await dbConnect();

        const user = await isAuthenticatedUser();
        authorizeRoles(user, "admin");

        const enquiries = await Enquiry.find().sort({ createdAt: -1 });

        return NextResponse.json({ success: true, enquiries }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch enquiries" },
            { status: 500 }
        );
    }
}

// Create new enquiry (Public)
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const enquiry = await Enquiry.create(body);

        return NextResponse.json({ success: true, enquiry }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to create enquiry" },
            { status: 500 }
        );
    }
}
