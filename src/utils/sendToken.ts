import { NextResponse } from "next/server";
import { IUser } from "@/models/User";

const sendToken = (user: IUser, statusCode: number) => {
    const token = user.getJwtToken();

    const cookieOptions = {
        httpOnly: true,
        maxAge: (Number(process.env.COOKIE_EXPIRES_TIME) || 7) * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
    };

    const response = NextResponse.json(
        {
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
        },
        { status: statusCode }
    );

    response.cookies.set("userToken", token, cookieOptions);

    return response;
};

export default sendToken;
