import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { isAuthenticatedUser, isAdminUser } from "@/lib/auth";

// Get single user (Self or Admin)
export async function GET(
    _request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const currentUser = await isAuthenticatedUser();

        // Only Admin can see other users, or user can see themselves
        if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
            return NextResponse.json(
                { success: false, message: "Not authorized" },
                { status: 403 }
            );
        }

        const user = await User.findById(id).select("-password -googleId");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch user" },
            { status: 500 }
        );
    }
}

// Update user (Self or Admin)
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const currentUser = await isAuthenticatedUser();

        if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
            return NextResponse.json(
                { success: false, message: "Not authorized" },
                { status: 403 }
            );
        }

        const body = await request.json();

        // Prevent updating isAdmin unless current user is an admin
        if (currentUser.role !== "admin" && body.isAdmin !== undefined) {
            delete body.isAdmin;
        }

        const user = await User.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to update user" },
            { status: 500 }
        );
    }
}

// Delete user (Admin only)
export async function DELETE(
    _request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        await isAdminUser();

        const { id } = await context.params;
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        await user.deleteOne();

        return NextResponse.json(
            { success: true, message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to delete user" },
            { status: 500 }
        );
    }
}
