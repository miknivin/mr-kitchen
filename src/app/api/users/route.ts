import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { isAdminUser } from "@/lib/auth";

// Get all users (Admin only)
export async function GET() {
    try {
        await dbConnect();
        await isAdminUser();

        const users = await User.find().select("-password");

        return NextResponse.json({ success: true, users }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch users" },
            { status: 500 }
        );
    }
}
