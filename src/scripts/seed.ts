import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/role.model.js";
import Employee from "../models/employee.model.js";
import Contact from "../models/contact.model.js";
import Company from "../models/company.model.js";
import Deal from "../models/deal.model.js";
import Order from "../models/order.model.js";
import Ticket from "../models/ticket.model.js";
import bcrypt from "bcrypt";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/neocrm-dev";

const resourcesCount = 10;

// Helpers for random data
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomBoolean = () => Math.random() < 0.5;
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Realistic Data Arrays
const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const companyNames = ["Acme Corp", "Globex Corporation", "Soylent Corp", "Initech", "Umbrella Corp", "Stark Industries", "Wayne Enterprises", "Cyberdyne Systems", "Massive Dynamic", "Hooli", "Pied Piper", "Vandelay Industries", "Aperture Science", "Black Mesa", "Tyrell Corporation"];
const industries = ["Technology", "Finance", "Healthcare", "Retail", "Manufacturing", "Education", "Real Estate", "Entertainment", "Energy", "Transportation"];
const jobTitles = ["CEO", "CTO", "Manager", "Sales Representative", "Software Engineer", "HR Specialist", "Accountant", "Marketing Director", "Consultant", "Assistant"];
const streets = ["Main St", "High St", "Broadway", "Market St", "Park Ave", "Oak St", "Maple Ave", "Washington St", "Cedar Ln", "Elm St"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];

const generateName = () => `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
const generatePhone = () => `+1 (${getRandomInt(200, 900)}) ${getRandomInt(200, 900)}-${getRandomInt(1000, 9999)}`;
const generateAddress = () => `${getRandomInt(100, 9999)} ${getRandomElement(streets)}, ${getRandomElement(cities)}, USA`;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for seeding");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

const clearData = async () => {
    console.log("Clearing existing data...");
    await Ticket.deleteMany({});
    await Order.deleteMany({});
    await Deal.deleteMany({});
    await Company.deleteMany({});
    await Contact.deleteMany({});
    await Employee.deleteMany({});
    await Role.deleteMany({});
    console.log("Data cleared");
};

const seedRoles = async () => {
    console.log("Seeding Roles...");
    const roleNames = [
        "Administrator", "Sales Manager", "Sales Representative", "Support Agent",
        "Account Manager", "Marketing Specialist", "Product Manager", "Billing Coordinator",
        "HR Specialist", "IT Support"
    ];

    // Ensure we have at least resourcesCount roles, cycle if needed
    const rolesToCreate = [];
    for (let i = 0; i < resourcesCount; i++) {
        const name = i < roleNames.length ? roleNames[i] : `Custom Role ${i}`;
        rolesToCreate.push({
            name: name,
            isActive: true, // Most active
            Company: { read: true, write: getRandomBoolean(), delete: getRandomBoolean() },
            Employee: { read: true, write: getRandomBoolean(), delete: getRandomBoolean() },
            Contact: { read: true, write: getRandomBoolean(), delete: getRandomBoolean() },
            Deal: { read: true, write: getRandomBoolean(), delete: getRandomBoolean() },
            Role: { read: true, write: getRandomBoolean(), delete: getRandomBoolean() },
            Order: { read: true, write: getRandomBoolean(), delete: getRandomBoolean() },
            Ticket: { read: true, write: getRandomBoolean(), delete: getRandomBoolean() },
        });
    }
    return await Role.insertMany(rolesToCreate);
};

const seedEmployees = async (roles: any[]) => {
    console.log("Seeding Employees...");
    const employees = [];
    for (let i = 0; i < resourcesCount; i++) {
        const fullName = generateName();
        const firstName = fullName.split(" ")[0].toLowerCase();
        employees.push({
            fullName: fullName,
            phone: generatePhone(),
            email: `${firstName}.${i}@nexify.com`,
            password: bcrypt.hashSync("password123", 10), // Simplified
            role: getRandomElement(roles)._id,
            salary: getRandomInt(40000, 150000),
            isActive: Math.random() > 0.1, // 90% active
            resetExpire: getRandomBoolean() ? new Date(Date.now() + 3600000) : undefined
        });
    }
    return await Employee.insertMany(employees);
};

const seedContacts = async (employees: any[]) => {
    console.log("Seeding Contacts...");
    const contacts = [];
    for (let i = 0; i < resourcesCount; i++) {
        const fullName = generateName();
        const firstName = fullName.split(" ")[0].toLowerCase();
        contacts.push({
            name: fullName,
            phone: generatePhone(),
            email: `${firstName}.${i}@example.com`,
            address: generateAddress(),
            jobTitle: getRandomElement(jobTitles),
            owner: getRandomElement(employees)._id,
            stage: [{ name: getRandomBoolean() ? "Lead" : "Customer", date: new Date() }],
            isActive: Math.random() > 0.2,
            source: getRandomElement(["Referral", "Online", "Other", "In Person", "Email", "Phone"]),
            history: [
                {
                    mean: getRandomElement(["Meeting", "Call", "Email", "Other"]),
                    date: getRandomDate(new Date(2023, 0, 1), new Date()),
                    note: "Initial contact discussion",
                    employee: getRandomElement(employees)._id
                }
            ],
            notes: "Interested in our premium services.",
            seniority: getRandomElement(["Entry Level", "Mid Level", "Senior", "Executive", "Other"]),
            socialMedia: {
                linkedin: `linkedin.com/in/${firstName}${i}`,
                twitter: `@${firstName}${i}`,
                facebook: `facebook.com/${firstName}${i}`
            }
        });
    }
    return await Contact.insertMany(contacts);
};

const seedCompanies = async (employees: any[], contacts: any[]) => {
    console.log("Seeding Companies...");
    const companiesToInsert = [];
    for (let i = 0; i < resourcesCount; i++) {
        const name = getRandomElement(companyNames) + ((i > 10) ? ` ${i}` : "");
        companiesToInsert.push({
            name: name,
            owner: getRandomElement(employees)._id,
            contact: getRandomElement(contacts)._id,
            website: `www.${name.replace(/\s/g, "").toLowerCase()}.com`,
            email: `contact@${name.replace(/\s/g, "").toLowerCase()}.com`,
            industry: getRandomElement(industries),
            type: getRandomElement(["Public", "Private", "Non-Profit", "Government"]),
            address: generateAddress(),
            numberOfEmployees: getRandomInt(10, 5000),
            isActive: true,
            region: getRandomElement(["North America", "Europe", "Asia", "South America"]),
            annualRevenue: getRandomInt(100000, 100000000),
            description: "A leading company in its field.",
            growthStage: getRandomElement(["Startup", "Established", "Matured", "Declining"]),
            accountStage: [
                { name: getRandomElement(["Lead", "Customer"]), date: new Date() }
            ],
            phone: generatePhone(),
            source: getRandomElement(["Referral", "Online", "Other", "In Person", "Email", "Phone"]),
            history: [
                {
                    mean: getRandomElement(["Meeting", "Call", "Email", "Other"]),
                    date: getRandomDate(new Date(2023, 0, 1), new Date()),
                    note: "Quarterly review",
                    employee: getRandomElement(employees)._id
                }
            ]
        });
    }
    const createdCompanies = await Company.insertMany(companiesToInsert);

    // Link contacts to companies
    for (const contact of contacts) {
        await Contact.findByIdAndUpdate(contact._id, { company: getRandomElement(createdCompanies)._id });
    }

    return createdCompanies;
};

const seedDeals = async (employees: any[], contacts: any[], companies: any[]) => {
    console.log("Seeding Deals...");
    const deals = [];
    for (let i = 0; i < resourcesCount; i++) {
        const company = getRandomElement(companies);
        deals.push({
            name: `${company.name} Deal - Q${getRandomInt(1, 4)}`,
            stage: [
                {
                    name: getRandomElement([
                        "Appointment Scheduled", "Qualified To Buy", "Presentation Scheduled",
                        "Decision Maker Bought-In", "Contract Sent", "Closed Won", "Closed Lost"
                    ]),
                    date: new Date(),
                    note: "Progressing well"
                }
            ],
            amount: getRandomInt(1000, 50000),
            owner: getRandomElement(employees)._id,
            priority: getRandomElement(["High", "Medium", "Low"]),
            contact: getRandomElement(contacts)._id,
            company: company._id,
            expectedCloseDate: getRandomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 6)))
        });
    }
    return await Deal.insertMany(deals);
};

const seedOrders = async (employees: any[], contacts: any[], companies: any[]) => {
    console.log("Seeding Orders...");
    const orders = [];
    for (let i = 0; i < resourcesCount; i++) {
        const company = getRandomElement(companies);
        orders.push({
            description: `Order #${1000 + i} for ${company.name}`,
            owner: getRandomElement(employees)._id,
            stage: [
                { stageType: getRandomElement(["Open", "Processing", "Shipped", "Delivered", "Cancelled"]), date: new Date() }
            ],
            contact: getRandomElement(contacts)._id,
            employee: getRandomElement(employees)._id,
            products: [
                { name: "Premium Widget", unitPrice: 150, quantity: getRandomInt(1, 10) },
                { name: "Service Plan", unitPrice: 500, quantity: 1 }
            ],
            orderType: getRandomElement(["One Time", "Subscription"]),
            source: getRandomElement(["Referral", "Online", "Other", "In Person", "Email", "Phone"]),
            company: company._id,
            taxes: getRandomInt(50, 500),
            expectedDeliveryDate: getRandomDate(new Date(), new Date(new Date().setDate(new Date().getDate() + 14))),
            shippingAddress: generateAddress(),
            paymentStatus: [
                {
                    stage: getRandomElement(["Pending", "Paid", "Failed", "Refunded"]),
                    date: new Date(),
                    note: "Payment processed via Stripe"
                }
            ]
        });
    }
    return await Order.insertMany(orders);
};

const seedTickets = async (employees: any[], contacts: any[], companies: any[]) => {
    console.log("Seeding Tickets...");
    const tickets = [];
    const issues = ["Login issue", "Billing question", "Feature request", "Bug report", "Account access", "Payment failure", "Integration error", "Performance issue"];

    for (let i = 0; i < resourcesCount; i++) {
        const company = getRandomElement(companies);
        tickets.push({
            name: `${getRandomElement(issues)} - ${company.name}`,
            status: [
                { statusType: getRandomElement(["Open", "In Progress", "Resolved", "Closed"]), date: new Date() }
            ],
            description: "User is reporting an issue with the system. Please investigate.",
            owner: getRandomElement(employees)._id,
            source: getRandomElement(["Chat", "Email", "Phone", "Form"]),
            priority: getRandomElement(["Low", "Medium", "High", "Critical"]),
            contact: getRandomElement(contacts)._id,
            category: getRandomElement(["Bug", "Question", "Request", "Billing", "Other"]),
            company: company._id,
            feedback: getRandomBoolean() ? "Great service!" : undefined,
            firstResponseDueDate: getRandomDate(new Date(), new Date(new Date().setDate(new Date().getDate() + 1))),
            resolutionDueDate: getRandomDate(new Date(), new Date(new Date().setDate(new Date().getDate() + 3))),
            resolutionStatus: getRandomElement(["Pending", "Solved", "Workaround", "Won't Fix"])
        });
    }
    return await Ticket.insertMany(tickets);
};

const runSeed = async () => {
    await connectDB();
    await clearData();

    const roles = await seedRoles();
    const employees = await seedEmployees(roles);
    const contacts = await seedContacts(employees);
    const companies = await seedCompanies(employees, contacts);

    await seedDeals(employees, contacts, companies);
    await seedOrders(employees, contacts, companies);
    await seedTickets(employees, contacts, companies);

    console.log("Seeding completed successfully!");
    mongoose.connection.close();
};

runSeed();
