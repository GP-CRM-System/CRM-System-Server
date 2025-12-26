import mongoose from "mongoose";
import type { ICompany } from "../interfaces/company.interface.js";

const companySchema = new mongoose.Schema<ICompany>({
    name: { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Employee"
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Contact"
    },
    website: { type: String, required: false },
    email: { type: String, required: false },
    industry: { type: String },
    type: { type: String, required: true },
    address: { type: String, required: false },
    numberOfEmployees: { type: Number, required: false, default: 0 },
    isActive: { type: Boolean, default: true },

    //extra fields
    region: { type: String },
    annualRevenue: { type: Number },
    description: { type: String },
    growthStage: {
        type: String,
        enum: ["Startup", "Established", "Matured", "Declining"]
    },
    accountStage: {
        type: [
            {
                name: { type: String, enum: ["Lead", "Customer"] },
                date: { type: Date }
            }
        ],
        default: [{ name: "Lead", date: new Date() }]
    },
    phone: { type: String },
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

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Company = mongoose.model<ICompany>("Company", companySchema);
export default Company;
