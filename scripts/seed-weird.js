import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from '@faker-js/faker';
import { industries } from '../src/interfaces/company.interface.js';
import Employee from "../src/models/employee.model.js";
import Company from "../src/models/company.model.js";
import Contact from "../src/models/contact.model.js";
import Deal from "../src/models/deal.model.js";
import Order from "../src/models/order.model.js";
import Ticket from "../src/models/ticket.model.js";
import Role from "../src/models/role.model.js";
// Load environment variables
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/nexify";
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function weirdString(length = 10) {
    // Deprecated: use faker for realistic data
    return faker.string.alphanumeric(length);
}
async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
        // Clear existing data
        await Promise.all([
            Employee.deleteMany({}),
            Company.deleteMany({}),
            Contact.deleteMany({}),
            Deal.deleteMany({}),
            Order.deleteMany({}),
            Ticket.deleteMany({}),
            Role.deleteMany({})
        ]);
        // Insert Roles
        const roleNames = ["Admin", "Manager", "Sales", "Support", "Intern", faker.person.jobTitle(), faker.person.jobTitle()];
        const roles = await Role.insertMany(roleNames.map(name => ({
            name,
            isActive: faker.datatype.boolean(),
            Company: { read: true, write: faker.datatype.boolean(), delete: faker.datatype.boolean() },
            Employee: { read: true, write: faker.datatype.boolean(), delete: faker.datatype.boolean() },
            Contact: { read: true, write: faker.datatype.boolean(), delete: faker.datatype.boolean() },
            Deal: { read: true, write: faker.datatype.boolean(), delete: faker.datatype.boolean() },
            Role: { read: true, write: faker.datatype.boolean(), delete: faker.datatype.boolean() },
            Order: { read: true, write: faker.datatype.boolean(), delete: faker.datatype.boolean() },
            Ticket: { read: true, write: faker.datatype.boolean(), delete: faker.datatype.boolean() },
            createdAt: randomDate(new Date(2020, 0, 1), new Date()),
            updatedAt: randomDate(new Date(2020, 0, 1), new Date())
        })));
        // Insert Employees
        const employees = await Employee.insertMany(Array.from({ length: 10 }, (_, i) => ({
            fullName: faker.person.fullName(),
            phone: faker.phone.number('+20##########'),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: roles[Math.floor(Math.random() * roles.length)]._id,
            salary: faker.number.int({ min: 5000, max: 100000 }),
            isActive: faker.datatype.boolean(),
            resetExpire: randomDate(new Date(2020, 0, 1), new Date(2026, 0, 1)),
            createdAt: randomDate(new Date(2020, 0, 1), new Date()),
            updatedAt: randomDate(new Date(2020, 0, 1), new Date())
        })));
        // Insert Contacts first (without company)
        const contacts = await Contact.insertMany(Array.from({ length: 15 }, (_, i) => {
            // Simulate stage transitions: some start as leads, some as customers, some switch
            const stageHistory = [];
            let isLead = faker.datatype.boolean();
            let stageDate = randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1));
            stageHistory.push({ name: isLead ? "Lead" : "Customer", date: stageDate });
            // 50% chance to switch stage after some time
            if (faker.datatype.boolean()) {
                isLead = !isLead;
                stageDate = randomDate(stageDate, new Date());
                stageHistory.push({ name: isLead ? "Lead" : "Customer", date: stageDate });
            }
            return {
                name: faker.person.fullName(),
                phone: faker.phone.number('+20 1# ### ####'),
                email: faker.internet.email(),
                address: faker.location.streetAddress(),
                jobTitle: faker.person.jobTitle(),
                owner: employees[Math.floor(Math.random() * employees.length)]._id,
                stage: stageHistory,
                isActive: faker.datatype.boolean(),
                createdAt: randomDate(new Date(2020, 0, 1), new Date()),
                updatedAt: randomDate(new Date(2020, 0, 1), new Date()),
                // company will be set after companies are created
                source: faker.helpers.arrayElement(["Referral", "Online", "Other", "In Person", "Email", "Phone"]),
                history: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
                    mean: faker.helpers.arrayElement(["Meeting", "Call", "Email", "Other"]),
                    date: randomDate(new Date(2020, 0, 1), new Date()),
                    note: faker.lorem.sentence(),
                    employee: employees[Math.floor(Math.random() * employees.length)]._id
                })),
                notes: faker.lorem.paragraph(),
                seniority: faker.helpers.arrayElement(["Entry Level", "Mid Level", "Senior", "Executive", "Other"]),
                socialMedia: {
                    linkedin: faker.internet.url(),
                    twitter: faker.internet.url(),
                    facebook: faker.internet.url(),
                    instagram: faker.internet.url()
                }
            };
        }));
        // Insert Companies (with valid contact)
        const companies = await Company.insertMany(Array.from({ length: 8 }, (_, i) => {
            // Simulate accountStage transitions: some start as leads, some as customers, some switch
            const accountStageHistory = [];
            let isLead = faker.datatype.boolean();
            let stageDate = randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1));
            accountStageHistory.push({ name: isLead ? "Lead" : "Customer", date: stageDate });
            // 50% chance to switch stage after some time
            if (faker.datatype.boolean()) {
                isLead = !isLead;
                stageDate = randomDate(stageDate, new Date());
                accountStageHistory.push({ name: isLead ? "Lead" : "Customer", date: stageDate });
            }
            // Realistic annual revenue and employee count
            const annualRevenue = faker.finance.amount({ min: 10000, max: 10000000, dec: 2 });
            const numberOfEmployees = faker.number.int({ min: 2, max: 1000 });
            const contact = contacts[Math.floor(Math.random() * contacts.length)];
            return {
                name: faker.company.name(),
                owner: employees[Math.floor(Math.random() * employees.length)]._id,
                contact: contact._id,
                website: faker.internet.url(),
                email: faker.internet.email(),
                industry: faker.helpers.arrayElement(industries),
                type: faker.helpers.arrayElement(["Prospect", "Partner", "Reseller", "Vendor", "Other"]),
                address: faker.location.streetAddress(),
                numberOfEmployees,
                isActive: faker.datatype.boolean(),
                region: faker.location.city(),
                annualRevenue: parseFloat(annualRevenue),
                description: faker.lorem.paragraph(),
                growthStage: faker.helpers.arrayElement(["Startup", "Established", "Matured", "Declining"]),
                accountStage: accountStageHistory,
                phone: faker.phone.number('+20 1# ### ####'),
                source: faker.helpers.arrayElement(["Referral", "Online", "Other", "In Person", "Email", "Phone"]),
                history: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
                    mean: faker.helpers.arrayElement(["Meeting", "Call", "Email", "Other"]),
                    date: randomDate(new Date(2020, 0, 1), new Date()),
                    note: faker.lorem.sentence(),
                    employee: employees[Math.floor(Math.random() * employees.length)]._id
                })),
                createdAt: randomDate(new Date(2020, 0, 1), new Date()),
                updatedAt: randomDate(new Date(2020, 0, 1), new Date())
            };
        }));
        // Update contacts with company references
        for (let i = 0; i < contacts.length; i++) {
            const company = companies[Math.floor(Math.random() * companies.length)];
            if (company) {
                await Contact.updateOne({ _id: contacts[i]._id }, { company: company._id });
            }
        }
        // Insert Deals
        await Deal.insertMany(Array.from({ length: 12 }, (_, i) => {
            // Simulate distributed deal stages
            const dealStages = [
                "Appointment Scheduled",
                "Qualified To Buy",
                "Presentation Scheduled",
                "Decision Maker Bought-In",
                "Contract Sent",
                "Closed Won",
                "Closed Lost"
            ];
            const stageHistory = [];
            let stageIdx = faker.number.int({ min: 0, max: 3 });
            let stageDate = randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1));
            stageHistory.push({ name: dealStages[stageIdx], date: stageDate, note: faker.lorem.sentence() });
            // 50% chance to progress to another stage
            if (faker.datatype.boolean()) {
                stageIdx = faker.number.int({ min: 4, max: 6 });
                stageDate = randomDate(stageDate, new Date());
                stageHistory.push({ name: dealStages[stageIdx], date: stageDate, note: faker.lorem.sentence() });
            }
            return {
                name: faker.commerce.productName(),
                stage: stageHistory,
                amount: parseFloat(faker.finance.amount({ min: 1000, max: 100000, dec: 2 })),
                owner: employees[Math.floor(Math.random() * employees.length)]._id,
                priority: faker.helpers.arrayElement(["Low", "Medium", "High"]),
                contact: contacts[Math.floor(Math.random() * contacts.length)]._id,
                company: companies[Math.floor(Math.random() * companies.length)]._id,
                createdAt: randomDate(new Date(2020, 0, 1), new Date()),
                updatedAt: randomDate(new Date(2020, 0, 1), new Date()),
                expectedCloseDate: randomDate(new Date(2020, 0, 1), new Date())
            };
        }));
        // Insert Orders
        await Order.insertMany(Array.from({ length: 10 }, (_, i) => {
            // Simulate payment status transitions
            const paymentStages = ["Pending", "Paid", "Failed", "Refunded"];
            const paymentHistory = [];
            let payIdx = 0;
            let payDate = randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1));
            paymentHistory.push({ stage: paymentStages[payIdx], date: payDate, note: faker.lorem.sentence() });
            // 60% chance to progress to another payment status
            if (faker.datatype.boolean() || faker.datatype.boolean()) {
                payIdx = faker.number.int({ min: 1, max: 3 });
                payDate = randomDate(payDate, new Date());
                paymentHistory.push({ stage: paymentStages[payIdx], date: payDate, note: faker.lorem.sentence() });
            }
            return {
                description: faker.commerce.productDescription(),
                owner: employees[Math.floor(Math.random() * employees.length)]._id,
                stage: [{ stageType: "Open", date: randomDate(new Date(2020, 0, 1), new Date()) }],
                contact: contacts[Math.floor(Math.random() * contacts.length)]._id,
                employee: employees[Math.floor(Math.random() * employees.length)]._id,
                products: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
                    name: faker.commerce.productName(),
                    unitPrice: parseFloat(faker.finance.amount({ min: 10, max: 1000, dec: 2 })),
                    quantity: faker.number.int({ min: 1, max: 10 })
                })),
                createdAt: randomDate(new Date(2020, 0, 1), new Date()),
                updatedAt: randomDate(new Date(2020, 0, 1), new Date()),
                orderType: faker.helpers.arrayElement(["One Time", "Subscription"]),
                source: faker.helpers.arrayElement(["Referral", "Online", "Other", "In Person", "Email", "Phone"]),
                company: companies[Math.floor(Math.random() * companies.length)]._id,
                taxes: parseFloat(faker.finance.amount({ min: 0, max: 1000, dec: 2 })),
                expectedDeliveryDate: randomDate(new Date(2020, 0, 1), new Date()),
                shippingAddress: faker.location.streetAddress(),
                paymentStatus: paymentHistory
            };
        }));
        // Insert Tickets
        await Ticket.insertMany(Array.from({ length: 14 }, (_, i) => {
            // Simulate status transitions
            const ticketStatuses = ["Open", "Closed", "Pending"];
            const statusHistory = [];
            let statusIdx = faker.number.int({ min: 0, max: 1 });
            let statusDate = randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1));
            statusHistory.push({ statusType: ticketStatuses[statusIdx], date: statusDate });
            // 50% chance to progress to another status
            if (faker.datatype.boolean()) {
                statusIdx = faker.number.int({ min: 1, max: 2 });
                statusDate = randomDate(statusDate, new Date());
                statusHistory.push({ statusType: ticketStatuses[statusIdx], date: statusDate });
            }
            return {
                name: faker.lorem.words({ min: 2, max: 4 }),
                status: statusHistory,
                description: faker.lorem.paragraph(),
                owner: employees[Math.floor(Math.random() * employees.length)]._id,
                source: faker.helpers.arrayElement(["Chat", "Email", "Phone", "Form"]),
                priority: faker.helpers.arrayElement(["Low", "Medium", "High", "Critical"]),
                contact: contacts[Math.floor(Math.random() * contacts.length)]._id,
                createdAt: randomDate(new Date(2020, 0, 1), new Date()),
                updatedAt: randomDate(new Date(2020, 0, 1), new Date()),
                category: faker.helpers.arrayElement(["Bug", "Question", "Request", "Billing", "Other"]),
                company: companies[Math.floor(Math.random() * companies.length)]._id,
                feedback: faker.lorem.sentence(),
                firstResponseDueDate: randomDate(new Date(2020, 0, 1), new Date()),
                resolutionDueDate: randomDate(new Date(2020, 0, 1), new Date()),
                resolutionStatus: faker.helpers.arrayElement(["Pending", "Solved", "Workaround", "Won't Fix"])
            };
        }));
        console.log("Weird mock data inserted successfully.");
        process.exit(0);
    }
    catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed-weird.js.map