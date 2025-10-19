import mongoose from "mongoose";
import type { IEmployee } from "../interfaces/employee.interface.js";

const employeeSchema = new mongoose.Schema<IEmployee>({
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Role"
  },
  salary: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
});

const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);
export default Employee;
