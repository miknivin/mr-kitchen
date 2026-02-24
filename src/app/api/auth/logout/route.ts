import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.json({ message: "Logged Out" }, { status: 200 });

    response.cookies.set("userToken", "", {
        expires: new Date(0),
        httpOnly: true,
        path: "/",
    });

    return response;
}
