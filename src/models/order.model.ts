import mongoose from "mongoose";
import type { IOrder } from "../interfaces/order.interface.js";

const orderSchema = new mongoose.Schema<IOrder>({
    description: { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Employee"
    },
    stage: [
        {
            stageType: { type: String, required: true, default: "Open" },
            date: { type: Date, required: true, default: new Date() }
        }
    ],
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Contact"
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Employee"
    },
    products: [
        {
            name: String,
            unitPrice: Number,
            quantity: Number
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    //new fields
    orderType: {
        type: String,
        enum: ["One Time", "Subscription"],
        default: "One Time"
    },
    source: {
        type: String,
        enum: ["Referral", "Online", "Other", "In Person", "Email", "Phone"],
        default: "Other"
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    taxes: { type: Number, default: 0 },
    expectedDeliveryDate: { type: Date },
    shippingAddress: { type: String },
    paymentStatus: [
        {
            stage: {
                type: String,
                enum: ["Pending", "Paid", "Failed", "Refunded"],
                default: "Pending"
            },
            date: { type: Date, default: Date.now },
            note: { type: String }
        }
    ]
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
