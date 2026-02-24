import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/models/User";
import sendToken from "@/utils/sendToken";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email: identifier, password } = await request.json();

        if (!identifier || !password) {
            return NextResponse.json(
                { error: "Please enter email/phone & password" },
                { status: 400 }
            );
        }

        // Search user by email OR phone
        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { phone: identifier }
            ]
        }).select("+password");

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        return sendToken(user as IUser, 200);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
