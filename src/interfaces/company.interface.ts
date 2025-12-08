import mongoose from "mongoose";
import { z } from "zod";
import Employee from "../models/employee.model.js";
import Contact from "../models/contact.model.js";

export const industries = [
    "Accounting",
    "Airlines",
    "Alternative Dispute Resolution",
    "Alternative Medicine",
    "Animation",
    "Apparel & Fashion",
    "Architecture & Planning",
    "Arts & Crafts",
    "Automotive",
    "Aviation & Aerospace",
    "Banking",
    "Biotechnology",
    "Broadcast Media",
    "Building Materials",
    "Business Supplies & Equipment",
    "Capital Markets",
    "Chemicals",
    "Civic & Social Organization",
    "Civil Engineering",
    "Commercial Real Estate",
    "Computer & Network Security",
    "Computer Games",
    "Computer Hardware",
    "Computer Networking",
    "Computer Software",
    "Construction",
    "Consumer Electronics",
    "Consumer Goods",
    "Consumer Services",
    "Cosmetics",
    "Dairy",
    "Defense & Space",
    "Design",
    "Education Management",
    "E-Learning",
    "Electrical & Electronic Manufacturing",
    "Entertainment",
    "Environmental Services",
    "Events Services",
    "Executive Office",
    "Facilities Services",
    "Farming",
    "Financial Services",
    "Fine Art",
    "Fishery",
    "Food & Beverages",
    "Food Production",
    "Fund-Raising",
    "Furniture",
    "Gambling & Casinos",
    "Glass, Ceramics & Concrete",
    "Government Administration",
    "Government Relations",
    "Graphic Design",
    "Health, Wellness & Fitness",
    "Higher Education",
    "Hospital & Health Care",
    "Hospitality",
    "Human Resources",
    "Import & Export",
    "Individual & Family Services",
    "Industrial Automation",
    "Information Services",
    "Information Technology & Services",
    "Insurance",
    "International Affairs",
    "International Trade & Development",
    "Internet",
    "Investment Banking/Venture Capital",
    "Investment Management",
    "Judiciary",
    "Law Enforcement",
    "Law Practice",
    "Legal Services",
    "Legislative Office",
    "Leisure, Travel & Tourism",
    "Libraries",
    "Logistics & Supply Chain",
    "Luxury Goods & Jewelry",
    "Machinery",
    "Management Consulting",
    "Maritime",
    "Market Research",
    "Marketing & Advertising",
    "Mechanical or Industrial Engineering",
    "Media Production",
    "Medical Devices",
    "Medical Practice",
    "Mental Health Care",
    "Military",
    "Mining & Metals",
    "Motion Pictures & Film",
    "Museums & Institutions",
    "Music",
    "Nanotechnology",
    "Newspapers",
    "Non-Profit Organization Management",
    "Oil & Energy",
    "Online Publishing",
    "Outsourcing/Offshoring",
    "Package/Freight Delivery",
    "Packaging & Containers",
    "Paper & Forest Products",
    "Performing Arts",
    "Pharmaceuticals",
    "Philanthropy",
    "Photography",
    "Plastics",
    "Political Organization",
    "Primary/Secondary Education",
    "Printing",
    "Professional Training & Coaching",
    "Program Development",
    "Public Policy",
    "Public Relations & Communications",
    "Public Safety",
    "Publishing",
    "Railroad Manufacture",
    "Ranching",
    "Real Estate",
    "Recreational Facilities & Services",
    "Religious Institutions",
    "Renewables & Environment",
    "Research",
    "Restaurants",
    "Retail",
    "Security & Investigations",
    "Semiconductors",
    "Shipbuilding",
    "Sporting Goods",
    "Sports",
    "Staffing & Recruiting",
    "Supermarkets",
    "Telecommunications",
    "Textiles",
    "Think Tanks",
    "Tobacco",
    "Translation & Localization",
    "Transportation/Trucking/Railroad",
    "Utilities",
    "Venture Capital & Private Equity",
    "Veterinary",
    "Warehousing",
    "Wholesale",
    "Wine & Spirits",
    "Wireless",
    "Writing & Editing",
    "Mobile Games"
];

export const SCompany = z.object({
    name: z
        .string("Company name is required")
        .min(3, "Company name must be at least 3 characters long")
        .max(50, "Company name must be at most 50 characters long")
        .regex(
            /^[a-zA-Z ]+$/,
            "Company name must contain only letters and spaces"
        ),
    owner: z.custom<mongoose.Types.ObjectId>(async (val) => {
        mongoose.Types.ObjectId.isValid(val as string);
        return await Employee.findById(val);
    }, "Owner is should be a valid employee"),
    contact: z.custom<mongoose.Types.ObjectId>(async (val) => {
        mongoose.Types.ObjectId.isValid(val as string);
        return await Contact.findById(val);
    }, "Contact is should be a valid contact"),
    website: z.url("Website should be a valid URL").nullable(),
    email: z.email("Invalid email").nullable(),
    industry: z.enum(industries, "Invalid industry").optional(),
    type: z
        .enum(
            ["Prospect", "Partner", "Reseller", "Vendor", "Other"],
            "Invalid type"
        )
        .optional(),
    address: z
        .string("Address is required")
        .min(3, "Address must be at least 3 characters long")
        .max(100, "Address must be at most 100 characters long")
        .regex(
            /^[a-zA-Z0-9 ]+$/,
            "Address must contain only letters, numbers and spaces"
        )
        .nullable(),
    numberOfEmployees: z
        .number("Number of employees is required")
        .gt(1, "Number of employees must be greater than 1")
        .nullable(),
    isActive: z.boolean().default(true),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type ICompany = z.infer<typeof SCompany>;