import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "../src/models/employee.model.js";
import Company from "../src/models/company.model.js";
import Contact from "../src/models/contact.model.js";
import Deal from "../src/models/deal.model.js";
import Order from "../src/models/order.model.js";
import Ticket from "../src/models/ticket.model.js";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/nexify";

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
      Ticket.deleteMany({})
    ]);

    // Insert Employees
    const employees = await Employee.insertMany([
      { fullName: "Alice Smith", phone: "1234567890", email: "alice@example.com", password: "hashedpassword", role: null, salary: 50000 },
      { fullName: "Bob Johnson", phone: "0987654321", email: "bob@example.com", password: "hashedpassword", role: null, salary: 60000 }
    ]);

    // Insert Companies
    const companies = await Company.insertMany([
      { name: "Acme Corp", owner: employees[0]._id, contact: null, type: "Customer" },
      { name: "Globex Inc", owner: employees[1]._id, contact: null, type: "Lead" }
    ]);

    // Insert Contacts
    const contacts = await Contact.insertMany([
      { name: "Charlie Brown", owner: employees[0]._id, company: companies[0]._id },
      { name: "Dana White", owner: employees[1]._id, company: companies[1]._id }
    ]);

    // Update companies with contact references
    await Company.updateOne({ _id: companies[0]._id }, { contact: contacts[0]._id });
    await Company.updateOne({ _id: companies[1]._id }, { contact: contacts[1]._id });

    // Insert Deals
    await Deal.insertMany([
      { name: "Big Deal", stage: [{ name: "Appointment Scheduled", date: new Date() }], amount: 10000, owner: employees[0]._id, priority: "High", contact: contacts[0]._id, company: companies[0]._id },
      { name: "Small Deal", stage: [{ name: "Qualified To Buy", date: new Date() }], amount: 2000, owner: employees[1]._id, priority: "Low", contact: contacts[1]._id, company: companies[1]._id }
    ]);

    // Insert Orders
    await Order.insertMany([
      { description: "Order 1", owner: employees[0]._id, stage: [{ stageType: "Open", date: new Date() }], contact: contacts[0]._id, employee: employees[0]._id, company: companies[0]._id, products: [{ name: "Product A", unitPrice: 100, quantity: 2 }] },
      { description: "Order 2", owner: employees[1]._id, stage: [{ stageType: "Open", date: new Date() }], contact: contacts[1]._id, employee: employees[1]._id, company: companies[1]._id, products: [{ name: "Product B", unitPrice: 200, quantity: 1 }] }
    ]);

    // Insert Tickets
    await Ticket.insertMany([
      { name: "Support Ticket 1", status: [{ statusType: "Open", date: new Date() }], description: "Issue with product", owner: employees[0]._id, source: "Email", priority: "High", contact: contacts[0]._id, company: companies[0]._id },
      { name: "Support Ticket 2", status: [{ statusType: "Open", date: new Date() }], description: "Billing question", owner: employees[1]._id, source: "Phone", priority: "Low", contact: contacts[1]._id, company: companies[1]._id }
    ]);

    console.log("Mock data inserted successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seed();
