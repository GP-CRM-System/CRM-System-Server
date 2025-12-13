import mongoose from "mongoose";
import { z } from "zod";
import Employee from "../models/employee.model.js";
import Contact from "../models/contact.model.js";
import Company from "../models/company.model.js";

export const SOrder = z.object({
    description: z
        .string("Description is required")
        .min(3, "Description must be at least 3 characters long")
        .max(100, "Description must be at most 100 characters long")
        .regex(
            /^[a-zA-Z ,.]+$/,
            "Description must contain only letters, spaces, commas and periods"
        ),
    owner: z.custom<mongoose.Types.ObjectId>(async (val) => {
        mongoose.Types.ObjectId.isValid(val as string);
        return await Employee.findById(val);
    }, "Owner should be a valid employee"),
    stage: z.array(
        z.object({
            stageType: z.enum([
                "Open",
                "Processed",
                "Shipped",
                "Delivered",
                "Cancelled"
            ]),
            date: z.coerce.date()
        })
    ),
    contact: z.custom<mongoose.Types.ObjectId>(async (val) => {
        mongoose.Types.ObjectId.isValid(val as string);
        return await Contact.findById(val);
    }, "Contact should be a valid contact"),
    employee: z.custom<mongoose.Types.ObjectId>(async (val) => {
        mongoose.Types.ObjectId.isValid(val as string);
        return await Employee.findById(val);
    }, "Employee should be a valid employee"),
    products: z.array(
        z.object({
            name: z
                .string("Product name should be a string")
                .min(3, "Product name must be at least 3 characters long")
                .max(100, "Product name must be at most 100 characters long")
                .regex(
                    /^[a-zA-Z ,.]+$/,
                    "Product name must contain only letters, spaces, commas and periods"
                ),
            unitPrice: z
                .number("Product unit price should be a number")
                .gt(0, "Product unit price must be greater than 0"),
            quantity: z
                .number("Product quantity should be a number")
                .gt(0, "Product quantity must be greater than 0")
        })
    ),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().default(() => new Date()),

    //new fields
    orderType: z.enum(["One Time", "Subscription"]).optional(),
    source: z
        .enum(["Referral", "Online", "Other", "In Person", "Email", "Phone"])
        .optional(),
    company: z
        .custom<mongoose.Types.ObjectId>(async (val) => {
            mongoose.Types.ObjectId.isValid(val as string);
            return await Company.findById(val);
        }, "Company should be a valid company")
        .optional(),
    taxes: z.number().optional(),
    expectedDeliveryDate: z.coerce.date().optional(),
    shippingAddress: z.string().optional(),
    paymentStatus: z
        .array(
            z.object({
                stage: z.enum(["Pending", "Paid", "Failed", "Refunded"]),
                date: z.coerce.date(),
                note: z.string().optional()
            })
        )
        .optional()
});

export type IOrder = z.infer<typeof SOrder>;
