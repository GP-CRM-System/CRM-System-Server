import mongoose from "mongoose";
import type { IEmployee } from "../interfaces/employee.interface.js";

const employeeSchema = new mongoose.Schema<IEmployee>({
    fullName: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: false },
    role: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Role" },
    salary: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, required: true, default: true },
    resetExpire: { type: Date },
    resetToken: { type: String },
    inviteToken: { type: String },
    inviteExpire: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);
export default Employee;
