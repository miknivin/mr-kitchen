import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/models/User";

export const isAuthenticatedUser = async (): Promise<IUser> => {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
        throw new Error("You need to login to access this resource");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error("User not found. Please login again.");
        }

        return user;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

export const authorizeRoles = (user: IUser, ...roles: string[]) => {
    if (!roles.includes(user.role)) {
        throw new Error(`Role (${user.role}) is not allowed to access this resource`);
    }
};

export const isAdminUser = async () => {
    const user = await isAuthenticatedUser();
    if (user.role !== "admin") {
        throw new Error("Only admins are authorized to access this resource");
    }
    return user;
};

// Legacy Export for existing routes
export { isAuthenticatedUser as authUser };
