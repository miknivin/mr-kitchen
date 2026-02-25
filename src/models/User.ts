import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface IUser extends Document {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    avatar?: {
        public_id?: string;
        url: string;
    };
    role: "user" | "admin";
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    signupMethod: "OTP" | "Email/Password" | "OAuth";
    createdAt: Date;
    updatedAt: Date;

    // Methods
    comparePassword(enteredPassword: string): Promise<boolean>;
    getJwtToken(): string;
    getResetPasswordToken(): string;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [false, "Please enter your name"],
            maxlength: [50, "Your name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            validate: {
                validator: function (this: any, value: string) {
                    return !this.phone || !!value;
                },
                message: "Email or phone is required",
            },
        },
        phone: {
            type: String,
            unique: true,
            sparse: true,
            validate: {
                validator: function (this: any, value: string) {
                    return !this.email || !!value;
                },
                message: "Email or phone is required",
            },
        },
        password: {
            type: String,
            required: [false, "Please enter your password"],
            minlength: [6, "Your password must be longer than 6 characters"],
            select: false,
        },
        avatar: {
            public_id: String,
            url: String,
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"],
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        signupMethod: {
            type: String,
            enum: ["OTP", "Email/Password", "OAuth"],
            default: "Email/Password",
        },
    },
    { timestamps: true }
);

// Encrypting password before saving user
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password!, 10);
});

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT token
userSchema.methods.getJwtToken = function () {
    const secret = process.env.JWT_SECRET as string;
    const expires = (process.env.JWT_EXPIRES_TIME || "7d") as any;
    return jwt.sign({ id: this._id }, secret, { expiresIn: expires });
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);

    return resetToken;
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
