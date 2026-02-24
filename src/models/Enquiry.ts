
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiry extends Document {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            default: null,
        },
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Responded", "Closed"],
        },
    },
    { timestamps: true }
);

// Force re-register model so schema changes (like phone field) take effect
if (mongoose.models.Enquiry) {
    delete (mongoose.models as any).Enquiry;
}
const Enquiry: Model<IEnquiry> = mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
