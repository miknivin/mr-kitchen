import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/models/User";
import sendToken from "@/utils/sendToken";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { name, email, password, phone, signupMethod } = await request.json();

        if (!email && !phone) {
            return NextResponse.json({ error: "Email or phone number is required" }, { status: 400 });
        }

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        if (!password || password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
        }

        const existingUserQuery = [];
        if (email) existingUserQuery.push({ email: email.toLowerCase() });
        if (phone) existingUserQuery.push({ phone: phone.trim() });

        const existingUser = await User.findOne({ $or: existingUserQuery });
        if (existingUser) {
            const field = existingUser.email === email?.toLowerCase() ? "email" : "phone number";
            return NextResponse.json({ error: `A user with this ${field} already exists` }, { status: 400 });
        }

        const userData: any = {
            name: name.trim(),
            password,
            role: "user",
            signupMethod: signupMethod || "Email/Password",
        };

        if (email) userData.email = email.toLowerCase();
        if (phone) userData.phone = phone.trim();

        const user: IUser = await User.create(userData);
        return sendToken(user, 201);
    } catch (error: any) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json({ error: `This ${field} is already registered` }, { status: 400 });
        }
        return NextResponse.json(
            { error: error?.message || "Registration failed. Please try again." },
            { status: 500 }
        );
    }
}
