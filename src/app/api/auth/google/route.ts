import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/models/User";
import sendToken from "@/utils/sendToken";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { name, email, avatar } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        let user: IUser | null = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            user = await User.create({
                name,
                email: email.toLowerCase(),
                avatar: { url: avatar },
                signupMethod: "OAuth",
            });
        } else if (user.signupMethod !== "OAuth") {
            user.signupMethod = "OAuth";
            if (avatar && (!user.avatar || !user.avatar.url)) {
                user.avatar = { url: avatar };
            }
            await user.save();
        }

        if (!user) {
            throw new Error("Failed to process user authentication");
        }

        return sendToken(user, 200);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
