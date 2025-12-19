import mongoose from "mongoose";

import type { IContact } from "../interfaces/contact.interface.js";

const contactSchema = new mongoose.Schema<IContact>({
    name: { type: String, required: true },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    address: { type: String, required: false },
    jobTitle: { type: String, required: false },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Employee"
    },
    stage: {
        type: [
            {
                name: { type: String, enum: ["Lead", "Customer"] },
                date: { type: Date }
            }
        ],
        default: [{ name: "Lead", date: new Date() }]
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    //new fields
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    source: {
        type: String,
        enum: ["Referral", "Online", "Other", "In Person", "Email", "Phone"],
        default: "Other"
    },
    history: [
        {
            mean: {
                type: String,
                enum: ["Meeting", "Call", "Email", "Other"],
                default: "Other"
            },
            date: { type: Date, default: Date.now },
            note: { type: String },
            employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }
        }
    ],
    notes: { type: String },
    seniority: {
        type: String,
        enum: ["Entry Level", "Mid Level", "Senior", "Executive", "Other"],
        default: "Other"
    },
    socialMedia: {
        linkedin: { type: String },
        twitter: { type: String },
        facebook: { type: String },
        instagram: { type: String }
    }
});

const Contact = mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
