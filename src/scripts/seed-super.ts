import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
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

// ================================
// CONFIGURATION - Adjust these numbers as needed!
// ================================
const PRESET = process.env.SEED_PRESET || "LARGE"; // SMALL, MEDIUM, LARGE, MASSIVE, EXTREME

const PRESETS = {
    SMALL: {
        ROLES: 10,
        EMPLOYEES: 20,
        CONTACTS: 50,
        COMPANIES: 30,
        DEALS: 40,
        ORDERS: 60,
        TICKETS: 80
    },
    MEDIUM: {
        ROLES: 20,
        EMPLOYEES: 100,
        CONTACTS: 500,
        COMPANIES: 250,
        DEALS: 400,
        ORDERS: 750,
        TICKETS: 1000
    },
    LARGE: {
        ROLES: 25,
        EMPLOYEES: 200,
        CONTACTS: 1000,
        COMPANIES: 500,
        DEALS: 800,
        ORDERS: 1500,
        TICKETS: 2000
    },
    MASSIVE: {
        ROLES: 30,
        EMPLOYEES: 500,
        CONTACTS: 3000,
        COMPANIES: 1500,
        DEALS: 2500,
        ORDERS: 5000,
        TICKETS: 7000
    },
    EXTREME: {
        ROLES: 50,
        EMPLOYEES: 1000,
        CONTACTS: 10000,
        COMPANIES: 5000,
        DEALS: 8000,
        ORDERS: 15000,
        TICKETS: 20000
    }
};

const COUNTS = PRESETS[PRESET as keyof typeof PRESETS] || PRESETS.LARGE;

// Batch size for insertMany operations (prevents memory issues)
const BATCH_SIZE = 1000;

// Progress tracking
let progress = {
    total: 0,
    completed: 0
};

const calculateTotal = () => {
    progress.total = Object.values(COUNTS).reduce((a, b) => a + b, 0);
};

const updateProgress = (step: string, count: number) => {
    progress.completed += count;
    const percentage = ((progress.completed / progress.total) * 100).toFixed(2);
    console.log(`✓ ${step} - ${count} records (${percentage}% complete)`);
};

// Utility functions
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomElements = <T>(arr: T[], count: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, arr.length));
};
const getRandomBoolean = (probability = 0.5) => Math.random() < probability;
const getRandomDate = (start: Date, end: Date) => 
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomInt = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

// Insert in batches to prevent memory issues with large datasets
const batchInsert = async (model: any, data: any[], modelName: string) => {
    const results = [];
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        const inserted = await model.insertMany(batch);
        results.push(...inserted);
        if (data.length > BATCH_SIZE) {
            console.log(`   → Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(data.length / BATCH_SIZE)} completed`);
        }
    }
    return results;
};

// Enhanced Data Arrays
const INDUSTRIES = [
    "Technology", "Finance", "Healthcare", "Retail", "Manufacturing", "Education",
    "Real Estate", "Entertainment", "Energy", "Transportation", "Telecommunications",
    "Hospitality", "Food & Beverage", "Construction", "Insurance", "Legal",
    "Marketing & Advertising", "Consulting", "Media", "E-commerce", "Biotechnology",
    "Aerospace", "Agriculture", "Automotive", "Fashion", "Gaming", "Sports",
    "Logistics", "Pharmaceuticals", "Chemical", "Environmental", "Mining",
    "Publishing", "Security", "Tourism", "Wellness"
];

const JOB_TITLES = [
    // Executive
    "CEO", "CFO", "CTO", "COO", "CMO", "CIO", "VP of Sales", "VP of Engineering",
    "VP of Marketing", "VP of Operations", "President", "Managing Director", "Chief Strategy Officer",
    "Chief Innovation Officer", "Chief Data Officer", "Chief Revenue Officer",
    // Management
    "General Manager", "Regional Manager", "Product Manager", "Project Manager",
    "Account Manager", "Sales Manager", "Engineering Manager", "Marketing Manager",
    "Operations Manager", "HR Manager", "Finance Manager", "Customer Success Manager",
    "Program Manager", "Portfolio Manager", "Quality Manager", "Supply Chain Manager",
    // Senior
    "Senior Software Engineer", "Senior Analyst", "Senior Consultant", "Senior Designer",
    "Senior Developer", "Senior Account Executive", "Senior Data Scientist", "Senior Architect",
    "Senior Product Designer", "Senior Research Analyst", "Senior Project Coordinator",
    // Mid-level
    "Software Engineer", "Business Analyst", "Financial Analyst", "Data Analyst",
    "Sales Representative", "Marketing Specialist", "HR Specialist", "Consultant",
    "Designer", "Developer", "Accountant", "Systems Administrator", "Network Engineer",
    "Database Administrator", "UX Designer", "Content Writer", "Social Media Manager",
    // Entry-level
    "Junior Developer", "Associate Consultant", "Marketing Coordinator",
    "Sales Coordinator", "HR Coordinator", "Administrative Assistant", "Intern",
    "Junior Analyst", "Customer Service Representative", "Technical Support Specialist"
];

const COMPANY_TYPES = ["Public", "Private", "Non-Profit", "Government", "Partnership", "Sole Proprietorship", "LLC", "Corporation"];

const GROWTH_STAGES = ["Startup", "Established", "Matured", "Declining"];

const REGIONS = [
    "North America", "South America", "Europe", "Asia", "Africa", "Oceania",
    "Middle East", "Central America", "Caribbean", "Southeast Asia", "East Asia",
    "Eastern Europe", "Western Europe", "Southern Europe", "Northern Europe",
    "Sub-Saharan Africa", "North Africa", "Central Asia", "South Asia"
];

const SOURCES = ["Referral", "Online", "Other", "In Person", "Email", "Phone"];

const CONTACT_MEANS = ["Meeting", "Call", "Email", "Other"];

const DEAL_STAGES = [
    "Appointment Scheduled",
    "Qualified To Buy",
    "Presentation Scheduled",
    "Decision Maker Bought-In",
    "Contract Sent",
    "Closed Won",
    "Closed Lost"
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const ORDER_STAGES = ["Open", "Processing", "Shipped", "Delivered", "Cancelled", "Returned", "Refunded"];

const ORDER_TYPES = ["One Time", "Subscription"];

const PAYMENT_STAGES = ["Pending", "Paid", "Failed", "Refunded"];

const TICKET_SOURCES = ["Chat", "Email", "Phone", "Form"];

const TICKET_STATUS_TYPES = ["Open", "In Progress", "Resolved", "Closed", "Pending", "Escalated", "On Hold"];

const TICKET_CATEGORIES = ["Bug", "Question", "Request", "Billing", "Other"];

const TICKET_RESOLUTION_STATUS = ["Pending", "Solved", "Workaround", "Won't Fix"];

const SENIORITY_LEVELS = ["Entry Level", "Mid Level", "Senior", "Executive", "Other"];

const PRODUCT_NAMES = [
    "Enterprise Software License", "Professional Services Package", "Premium Widget",
    "Service Plan", "Cloud Storage Subscription", "API Access Bundle", "Training Program",
    "Custom Development Hours", "Maintenance Contract", "Support Package",
    "Hardware Device", "Security Suite", "Analytics Platform", "Integration Module",
    "Mobile App License", "Consulting Hours", "Data Migration Service", "Infrastructure Setup",
    "Monitoring Tools", "Backup Solution", "Collaboration Platform", "CRM System",
    "ERP Software", "Marketing Automation", "Business Intelligence Tools", "Project Management Software"
];

const TICKET_ISSUES = [
    "Login issue", "Billing question", "Feature request", "Bug report",
    "Account access", "Payment failure", "Integration error", "Performance issue",
    "Data sync problem", "Password reset", "API authentication", "Dashboard loading slow",
    "Report generation error", "Email notification not received", "Mobile app crash",
    "Export functionality broken", "Permission denied", "Configuration assistance needed",
    "Third-party integration issue", "Database connection timeout", "SSL certificate error",
    "User interface glitch", "Data import problem", "Backup restore needed", "License activation issue",
    "Two-factor authentication problem", "Webhook not triggering", "Search not working properly"
];

const ROLE_DESCRIPTIONS = {
    "Administrator": "Full system access and management capabilities",
    "Sales Manager": "Oversees sales team and manages major deals",
    "Sales Representative": "Handles day-to-day sales activities and client interactions",
    "Support Agent": "Provides customer support and handles tickets",
    "Account Manager": "Manages key client relationships",
    "Marketing Specialist": "Develops and executes marketing campaigns",
    "Product Manager": "Oversees product development and strategy",
    "Billing Coordinator": "Manages billing and payment processing",
    "HR Specialist": "Handles human resources and employee management",
    "IT Support": "Provides technical support and system maintenance"
};

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("\n🚀 Connected to MongoDB for massive data seeding\n");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

const clearData = async () => {
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
        Ticket.deleteMany({}),
        Order.deleteMany({}),
        Deal.deleteMany({}),
        Company.deleteMany({}),
        Contact.deleteMany({}),
        Employee.deleteMany({}),
        Role.deleteMany({})
    ]);
    console.log("✓ Data cleared\n");
};

const seedRoles = async () => {
    console.log("📋 Seeding Roles...");
    const roleNames = [
        "Administrator", "Sales Manager", "Sales Representative", "Support Agent",
        "Account Manager", "Marketing Specialist", "Product Manager", "Billing Coordinator",
        "HR Specialist", "IT Support", "Business Analyst", "Customer Success Manager",
        "Technical Support", "Finance Manager", "Operations Manager", "Legal Counsel",
        "Data Analyst", "Security Specialist", "Quality Assurance", "Training Coordinator",
        "Content Manager", "Partnership Manager", "Community Manager", "DevOps Engineer",
        "Research Analyst", "Compliance Officer", "Brand Manager", "Sales Engineer",
        "Solutions Architect", "Customer Success Director", "Revenue Operations Manager"
    ];

    const rolesToCreate = [];
    for (let i = 0; i < COUNTS.ROLES; i++) {
        const roleName = i < roleNames.length ? roleNames[i] : `Custom Role ${i + 1}`;
        const isHighPrivilege = i < 5; // First 5 roles have more permissions

        rolesToCreate.push({
            name: roleName,
            description: ROLE_DESCRIPTIONS[roleName as keyof typeof ROLE_DESCRIPTIONS] || `Custom role with specific permissions for ${roleName}`,
            isActive: getRandomBoolean(0.9),
            Company: {
                read: true,
                write: isHighPrivilege || getRandomBoolean(0.6),
                delete: isHighPrivilege || getRandomBoolean(0.3)
            },
            Employee: {
                read: true,
                write: isHighPrivilege || getRandomBoolean(0.5),
                delete: isHighPrivilege || getRandomBoolean(0.2)
            },
            Contact: {
                read: true,
                write: isHighPrivilege || getRandomBoolean(0.7),
                delete: isHighPrivilege || getRandomBoolean(0.4)
            },
            Deal: {
                read: true,
                write: isHighPrivilege || getRandomBoolean(0.7),
                delete: isHighPrivilege || getRandomBoolean(0.3)
            },
            Role: {
                read: isHighPrivilege || getRandomBoolean(0.5),
                write: isHighPrivilege || getRandomBoolean(0.2),
                delete: isHighPrivilege || getRandomBoolean(0.1)
            },
            Order: {
                read: true,
                write: isHighPrivilege || getRandomBoolean(0.6),
                delete: isHighPrivilege || getRandomBoolean(0.3)
            },
            Ticket: {
                read: true,
                write: isHighPrivilege || getRandomBoolean(0.8),
                delete: isHighPrivilege || getRandomBoolean(0.4)
            },
            Analytics: {
                read: isHighPrivilege || getRandomBoolean(0.7),
                write: isHighPrivilege || getRandomBoolean(0.3)
            },
            createdAt: faker.date.past({ years: 3 }),
            updatedAt: faker.date.recent({ days: 90 })
        });
    }
    const roles = await Role.insertMany(rolesToCreate);
    updateProgress("Roles", COUNTS.ROLES);
    return roles;
};

const seedEmployees = async (roles: any[]) => {
    console.log("👥 Seeding Employees...");
    const employees = [];
    const hashedPassword = await bcrypt.hash("password123", 10);

    for (let i = 0; i < COUNTS.EMPLOYEES; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const fullName = `${firstName} ${lastName}`;
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();
        const isActive = getRandomBoolean(0.85);

        employees.push({
            fullName,
            phone: faker.phone.number(),
            email,
            password: hashedPassword,
            role: getRandomElement(roles)._id,
            salary: getRandomInt(35000, 250000),
            isActive,
            resetExpire: getRandomBoolean(0.1) ? faker.date.future() : undefined,
            resetToken: getRandomBoolean(0.05) ? faker.string.alphanumeric(32) : undefined,
            inviteToken: getRandomBoolean(0.15) ? faker.string.alphanumeric(32) : undefined,
            inviteExpire: getRandomBoolean(0.15) ? faker.date.future() : undefined,
            createdAt: faker.date.past({ years: 2 }),
            updatedAt: faker.date.recent({ days: 30 })
        });
    }
    
    const createdEmployees = await batchInsert(Employee, employees, "Employee");
    updateProgress("Employees", COUNTS.EMPLOYEES);
    return createdEmployees;
};

const seedContacts = async (employees: any[]) => {
    console.log("📇 Seeding Contacts...");
    const contacts = [];

    for (let i = 0; i < COUNTS.CONTACTS; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const fullName = `${firstName} ${lastName}`;
        const isCustomer = getRandomBoolean(0.4);
        const hasHistory = getRandomBoolean(0.7);
        const historyCount = hasHistory ? getRandomInt(1, 5) : 0;

        const history = [];
        if (hasHistory) {
            for (let h = 0; h < historyCount; h++) {
                history.push({
                    mean: getRandomElement(CONTACT_MEANS),
                    date: faker.date.past({ years: 1 }),
                    note: faker.lorem.sentence(),
                    employee: getRandomElement(employees)._id
                });
            }
        }

        contacts.push({
            name: fullName,
            phone: faker.phone.number(),
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            address: faker.location.streetAddress({ useFullAddress: true }),
            jobTitle: getRandomElement(JOB_TITLES),
            owner: getRandomElement(employees)._id,
            stage: [{ 
                name: isCustomer ? "Customer" : "Lead", 
                date: faker.date.past({ years: 1 })
            }],
            isActive: getRandomBoolean(0.8),
            source: getRandomElement(SOURCES),
            history,
            notes: getRandomBoolean(0.6) ? faker.lorem.paragraph() : undefined,
            seniority: getRandomElement(SENIORITY_LEVELS),
            socialMedia: {
                linkedin: getRandomBoolean(0.7) ? faker.internet.url() : undefined,
                twitter: getRandomBoolean(0.4) ? `@${faker.internet.userName()}` : undefined,
                facebook: getRandomBoolean(0.5) ? faker.internet.url() : undefined,
                instagram: getRandomBoolean(0.3) ? `@${faker.internet.userName()}` : undefined
            },
            createdAt: faker.date.past({ years: 2 }),
            updatedAt: faker.date.recent({ days: 60 })
        });
    }
    
    const createdContacts = await batchInsert(Contact, contacts, "Contact");
    updateProgress("Contacts", COUNTS.CONTACTS);
    return createdContacts;
};

const seedCompanies = async (employees: any[], contacts: any[]) => {
    console.log("🏢 Seeding Companies...");
    const companies = [];

    for (let i = 0; i < COUNTS.COMPANIES; i++) {
        const companyName = faker.company.name();
        const isCustomer = getRandomBoolean(0.5);
        const hasHistory = getRandomBoolean(0.6);
        const historyCount = hasHistory ? getRandomInt(1, 8) : 0;

        const history = [];
        if (hasHistory) {
            for (let h = 0; h < historyCount; h++) {
                history.push({
                    mean: getRandomElement(CONTACT_MEANS),
                    date: faker.date.past({ years: 1 }),
                    note: faker.lorem.sentence(),
                    employee: getRandomElement(employees)._id
                });
            }
        }

        companies.push({
            name: companyName,
            owner: getRandomElement(employees)._id,
            contact: getRandomElement(contacts)._id,
            website: faker.internet.url(),
            email: faker.internet.email({ firstName: 'contact', lastName: companyName.split(' ')[0] }).toLowerCase(),
            industry: getRandomElement(INDUSTRIES),
            type: getRandomElement(COMPANY_TYPES),
            address: faker.location.streetAddress({ useFullAddress: true }),
            numberOfEmployees: getRandomInt(5, 10000),
            isActive: getRandomBoolean(0.85),
            region: getRandomElement(REGIONS),
            annualRevenue: getRandomInt(50000, 500000000),
            description: faker.company.catchPhrase(),
            growthStage: getRandomElement(GROWTH_STAGES),
            accountStage: [{
                name: isCustomer ? "Customer" : "Lead",
                date: faker.date.past({ years: 1 })
            }],
            phone: faker.phone.number(),
            source: getRandomElement(SOURCES),
            history,
            createdAt: faker.date.past({ years: 3 }),
            updatedAt: faker.date.recent({ days: 90 })
        });
    }
    
    const createdCompanies = await batchInsert(Company, companies, "Company");
    updateProgress("Companies", COUNTS.COMPANIES);

    // Link contacts to companies (some contacts get company associations)
    console.log("🔗 Linking Contacts to Companies...");
    const contactUpdates = [];
    for (let i = 0; i < contacts.length; i++) {
        if (getRandomBoolean(0.7)) { // 70% of contacts get linked to a company
            contactUpdates.push(
                Contact.findByIdAndUpdate(contacts[i]._id, {
                    company: getRandomElement(createdCompanies)._id
                })
            );
        }
        // Batch update every 100 contacts to prevent memory issues
        if (contactUpdates.length >= 100) {
            await Promise.all(contactUpdates);
            contactUpdates.length = 0;
        }
    }
    if (contactUpdates.length > 0) {
        await Promise.all(contactUpdates);
    }

    return createdCompanies;
};

const seedDeals = async (employees: any[], contacts: any[], companies: any[]) => {
    console.log("💼 Seeding Deals...");
    const deals = [];

    for (let i = 0; i < COUNTS.DEALS; i++) {
        const company = getRandomElement(companies);
        const contact = getRandomElement(contacts);
        const currentStage = getRandomElement(DEAL_STAGES);
        const stageCount = getRandomInt(1, 4);

        const stages = [];
        for (let s = 0; s < stageCount; s++) {
            stages.push({
                name: s === stageCount - 1 ? currentStage : getRandomElement(DEAL_STAGES),
                date: faker.date.past({ years: 1 }),
                note: faker.lorem.sentence()
            });
        }

        deals.push({
            name: `${company.name} - ${faker.commerce.productName()}`,
            stage: stages,
            amount: getRandomInt(500, 500000),
            owner: getRandomElement(employees)._id,
            priority: getRandomElement(PRIORITIES),
            contact: contact._id,
            company: company._id,
            expectedCloseDate: faker.date.future({ years: 1 }),
            createdAt: faker.date.past({ years: 2 }),
            updatedAt: faker.date.recent({ days: 45 })
        });
    }
    
    const createdDeals = await batchInsert(Deal, deals, "Deal");
    updateProgress("Deals", COUNTS.DEALS);
    return createdDeals;
};

const seedOrders = async (employees: any[], contacts: any[], companies: any[]) => {
    console.log("📦 Seeding Orders...");
    const orders = [];

    for (let i = 0; i < COUNTS.ORDERS; i++) {
        const company = getRandomElement(companies);
        const contact = getRandomElement(contacts);
        const productCount = getRandomInt(1, 5);
        const currentStageType = getRandomElement(ORDER_STAGES);
        const stageHistoryCount = getRandomInt(1, 3);

        const products = [];
        for (let p = 0; p < productCount; p++) {
            products.push({
                name: getRandomElement(PRODUCT_NAMES),
                unitPrice: getRandomInt(50, 5000),
                quantity: getRandomInt(1, 20)
            });
        }

        const stages = [];
        for (let s = 0; s < stageHistoryCount; s++) {
            stages.push({
                stageType: s === stageHistoryCount - 1 ? currentStageType : getRandomElement(ORDER_STAGES),
                date: faker.date.past({ years: 1 })
            });
        }

        const paymentHistoryCount = getRandomInt(1, 2);
        const paymentStatus = [];
        for (let ps = 0; ps < paymentHistoryCount; ps++) {
            paymentStatus.push({
                stage: getRandomElement(PAYMENT_STAGES),
                date: faker.date.past({ years: 1 }),
                note: faker.lorem.sentence()
            });
        }

        orders.push({
            description: `Order #${10000 + i} - ${faker.commerce.productDescription()}`,
            owner: getRandomElement(employees)._id,
            stage: stages,
            contact: contact._id,
            employee: getRandomElement(employees)._id,
            products,
            orderType: getRandomElement(ORDER_TYPES),
            source: getRandomElement(SOURCES),
            company: company._id,
            taxes: getRandomInt(10, 1000),
            expectedDeliveryDate: faker.date.future({ days: 30 }),
            shippingAddress: faker.location.streetAddress({ useFullAddress: true }),
            paymentStatus,
            createdAt: faker.date.past({ years: 2 }),
            updatedAt: faker.date.recent({ days: 30 })
        });
    }
    
    const createdOrders = await batchInsert(Order, orders, "Order");
    updateProgress("Orders", COUNTS.ORDERS);
    return createdOrders;
};

const seedTickets = async (employees: any[], contacts: any[], companies: any[]) => {
    console.log("🎫 Seeding Tickets...");
    const tickets = [];

    for (let i = 0; i < COUNTS.TICKETS; i++) {
        const company = getRandomElement(companies);
        const contact = getRandomElement(contacts);
        const statusHistoryCount = getRandomInt(1, 4);
        const hasFeedback = getRandomBoolean(0.3);

        const status = [];
        for (let s = 0; s < statusHistoryCount; s++) {
            status.push({
                statusType: getRandomElement(TICKET_STATUS_TYPES),
                date: faker.date.past({ years: 1 })
            });
        }

        tickets.push({
            name: `${getRandomElement(TICKET_ISSUES)} - #${20000 + i}`,
            status,
            description: faker.lorem.paragraph(),
            owner: getRandomElement(employees)._id,
            source: getRandomElement(TICKET_SOURCES),
            priority: getRandomElement(PRIORITIES),
            contact: contact._id,
            category: getRandomElement(TICKET_CATEGORIES),
            company: company._id,
            feedback: hasFeedback ? faker.lorem.sentence() : undefined,
            firstResponseDueDate: faker.date.future({ days: 2 }),
            resolutionDueDate: faker.date.future({ days: 7 }),
            resolutionStatus: getRandomElement(TICKET_RESOLUTION_STATUS),
            createdAt: faker.date.past({ years: 1 }),
            updatedAt: faker.date.recent({ days: 15 })
        });
    }
    
    const createdTickets = await batchInsert(Ticket, tickets, "Ticket");
    updateProgress("Tickets", COUNTS.TICKETS);
    return createdTickets;
};

const runSuperSeed = async () => {
    const startTime = Date.now();
    
    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║     NEXIFY CRM - SUPER DATABASE SEEDING               ║");
    console.log("╚════════════════════════════════════════════════════════╝\n");
    
    console.log(`📊 Preset: ${PRESET}`);
    console.log(`📊 Configuration:`);
    console.log(`   • Roles:     ${COUNTS.ROLES.toLocaleString()}`);
    console.log(`   • Employees: ${COUNTS.EMPLOYEES.toLocaleString()}`);
    console.log(`   • Contacts:  ${COUNTS.CONTACTS.toLocaleString()}`);
    console.log(`   • Companies: ${COUNTS.COMPANIES.toLocaleString()}`);
    console.log(`   • Deals:     ${COUNTS.DEALS.toLocaleString()}`);
    console.log(`   • Orders:    ${COUNTS.ORDERS.toLocaleString()}`);
    console.log(`   • Tickets:   ${COUNTS.TICKETS.toLocaleString()}`);
    console.log(`   • TOTAL:     ${Object.values(COUNTS).reduce((a, b) => a + b, 0).toLocaleString()} records\n`);

    calculateTotal();

    await connectDB();
    await clearData();

    console.log("🚀 Starting data generation...\n");

    const roles = await seedRoles();
    const employees = await seedEmployees(roles);
    const contacts = await seedContacts(employees);
    const companies = await seedCompanies(employees, contacts);
    await seedDeals(employees, contacts, companies);
    await seedOrders(employees, contacts, companies);
    await seedTickets(employees, contacts, companies);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("\n╔════════════════════════════════════════════════════════╗");
    console.log("║                  SEEDING COMPLETED! ✓                  ║");
    console.log("╚════════════════════════════════════════════════════════╝\n");
    console.log(`⏱️  Time taken: ${duration} seconds`);
    console.log(`📈 Records per second: ${(progress.total / parseFloat(duration)).toFixed(0)}`);
    console.log(`💾 Database: ${MONGO_URI.split('/').pop()}`);
    console.log("\n🎉 Your database is now enriched with tons of realistic data!\n");
    console.log("💡 To change preset, use: SEED_PRESET=EXTREME npm run seed:super");
    console.log("   Available presets: SMALL, MEDIUM, LARGE, MASSIVE, EXTREME\n");

    await mongoose.connection.close();
    process.exit(0);
};

// Handle errors
process.on("unhandledRejection", (error) => {
    console.error("\n❌ Unhandled error:", error);
    process.exit(1);
});

runSuperSeed();
