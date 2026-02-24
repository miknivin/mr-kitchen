import mongoose, { Schema, Document, Model } from "mongoose";


export interface IOrder extends Document {
    shippingInfo: {
        fullName?: string;
        address: string;
        address2?: string;
        email?: string;
        state?: string;
        city: string;
        phoneNo: string;
        zipCode: string;
        country: string;
    };
    user: mongoose.Types.ObjectId;
    orderItems: Array<{
        productId?: string;
        product?: mongoose.Types.ObjectId;
        name: string;
        price: string;
        quantity: number;
        image?: string;
        sku?: string;
        variant?: any;
        discountPrice?: string;
    }>;
    paymentMethod: "COD" | "Online";
    paymentInfo?: { id?: string; status?: string };
    itemsPrice: number;
    taxAmount: number;
    shippingAmount: number;
    totalAmount: number;
    couponApplied?: string;
    couponDiscount?: number;
    orderStatus: string;
    orderNotes?: string;
    waybill?: string;
    invoiceURL?: string;
    delhiveryCurrentOrderStatus?: string;
    cancelOrReturnReason?: string;
    cancelledAt?: Date;
    returnRequestedAt?: Date;
    refundAmount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        shippingInfo: {
            fullName: { type: String, required: false },
            address: { type: String, required: true },
            address2: { type: String, required: false },
            email: { type: String, required: false },
            state: { type: String, required: false },
            city: { type: String, required: true },
            phoneNo: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true, default: "India" },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderItems: [
            {
                productId: { type: String, required: false },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    required: false,
                },
                name: { type: String, required: true },
                price: { type: String, required: true },
                quantity: { type: Number, required: true },
                image: { type: String, required: false, default: "" },
                sku: { type: String, required: false },
                variant: { type: Schema.Types.Mixed, required: false },
                discountPrice: { type: String, required: false },
            },
        ],
        paymentMethod: {
            type: String,
            required: true,
            default: "COD",
            enum: ["COD", "Online"],
        },
        paymentInfo: {
            id: { type: String },
            status: { type: String },
        },
        itemsPrice: { type: Number, required: true, default: 0 },
        taxAmount: { type: Number, required: true, default: 0 },
        shippingAmount: { type: Number, required: true, default: 0 },
        totalAmount: { type: Number, required: true },
        couponApplied: { type: String, default: "No" },
        couponDiscount: { type: Number, default: 0 },
        orderStatus: {
            type: String,
            default: "Processing",
            enum: [
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
                "Return Requested",
                "Return Approved",
                "Return Rejected",
                "Returned",
                "Refunded",
            ],
        },
        orderNotes: { type: String, required: false },
        waybill: { type: String, required: false, unique: true, sparse: true },
        invoiceURL: { type: String, required: false },
        delhiveryCurrentOrderStatus: { type: String, required: false },
        cancelOrReturnReason: { type: String, required: false },
        cancelledAt: { type: Date, required: false },
        returnRequestedAt: { type: Date, required: false },
        refundAmount: { type: Number, required: false },
    },
    { timestamps: true }
);

const Order: Model<IOrder> =
    mongoose.models.Order ||
    mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
