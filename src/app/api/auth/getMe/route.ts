import { NextResponse } from "next/server";
import { isAuthenticatedUser } from "@/lib/auth";

export async function GET() {
    try {
        const user = await isAuthenticatedUser();
        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Not authenticated" },
            { status: 401 }
        );
    }
}
