
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    ratings: number;
    images: Array<{
        public_id: string;
        url: string;
    }>;
    category: string;
    seller: string;
    stockQuantity: number;
    features: string[];
    numOfReviews: number;
    reviews: Array<{
        user: mongoose.Types.ObjectId;
        name: string;
        rating: number;
        comment: string;
    }>;
    variants: Array<{
        size: string;
        price: number;
        discountPrice?: number;
        stockQuantity: number;
        imageUrl?: string[];
    }>;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "Please enter product name"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please enter product description"],
        },
        shortDescription: {
            type: String,
            required: [true, "Please enter short description"],
        },
        features: {
            type: [String],
            default: [],
        },
        price: {
            type: Number,
            required: [true, "Please enter product price"],
            default: 0.0,
        },
        ratings: {
            type: Number,
            default: 0,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        category: {
            type: String,
            required: [true, "Please select category for this product"],
            enum: {
                values: [
                    "Dishwash Gel",
                    "Surface Cleaner",
                    "Glass Cleaner",
                    "Toilet Cleaner",
                    "Laundry Detergent",
                ],
                message: "Please select correct category for product",
            },
        },
        seller: {
            type: String,
            required: [true, "Please enter product seller"],
        },
        stockQuantity: {
            type: Number,
            required: [true, "Please enter product stock"],
            default: 0,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                },
            },
        ],
        variants: [
            {
                size: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                discountPrice: {
                    type: Number,
                    default: 0,
                },
                stockQuantity: {
                    type: Number,
                    default: 0,
                },
                imageUrl: {
                    type: [String],
                    default: [],
                },
            },
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
