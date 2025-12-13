import mongoose, { Document } from "mongoose";
import { z } from "zod";
import Employee from "../models/employee.model.js";
import Company from "../models/company.model.js";

export const SContact = z.object({
    name: z
        .string("Contact name is required")
        .min(3, "Contact name must be at least 3 characters long")
        .max(50, "Contact name must be at most 50 characters long")
        .regex(
            /^[a-zA-Z ]+$/,
            "Contact name must contain only letters and spaces"
        ),
    email: z.email("Invalid email").nullable(),
    phone: z
        .string("Invalid phone")
        .min(7, "Phone must be at least 7 characters long")
        .max(14, "Phone must be at most 14 characters long")
        .nullable(),
    address: z
        .string("Address is required")
        .min(3, "Address must be at least 3 characters long")
        .max(100, "Address must be at most 100 characters long")
        .regex(
            /^[a-zA-Z0-9 ]+$/,
            "Address must contain only letters, numbers and spaces"
        )
        .nullable(),
    jobTitle: z
        .string("Invalid job title")
        .max(50, "Job title must be at most 50 characters long")
        .regex(/^[a-zA-Z ]+$/, "Job title must contain only letters and spaces")
        .nullable(),
    owner: z.custom<mongoose.Types.ObjectId>(async (val) => {
        mongoose.Types.ObjectId.isValid(val as string);
        return await Employee.findById(val);
    }, "Owner is should be a valid employee"),
    stage: z.array(
        z.object({
            name: z.enum(["Lead", "Customer"]),
            date: z.coerce.date()
        })
    ),
    isActive: z.boolean().default(true),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().default(() => new Date()),

    //new fields
    company: z
        .custom<mongoose.Types.ObjectId>(
            async (val): Promise<Document | null> => {
                mongoose.Types.ObjectId.isValid(val as string);
                return await Company.findById(val);
            },
            "Company is should be a valid company"
        )
        .optional(),
    source: z
        .enum(["Referral", "Online", "Other", "In Person", "Email", "Phone"])
        .optional(),
    history: z
        .array(
            z.object({
                mean: z.enum(["Meeting", "Call", "Email", "Other"]).optional(),
                date: z.coerce.date().optional(),
                note: z.string().optional(),
                employee: z
                    .custom<mongoose.Types.ObjectId>(async (val) => {
                        mongoose.Types.ObjectId.isValid(val as string);
                        return await Employee.findById(val);
                    }, "Employee is should be a valid employee")
                    .optional()
            })
        )
        .optional(),
    notes: z.string().optional(),
    seniority: z
        .enum(["Entry Level", "Mid Level", "Senior", "Executive", "Other"])
        .optional(),
    socialMedia: z
        .object({
            linkedin: z.string().nullable().optional(),
            twitter: z.string().nullable().optional(),
            facebook: z.string().nullable().optional(),
            instagram: z.string().nullable().optional()
        })
        .optional()
});

export type IContact = z.infer<typeof SContact>;
