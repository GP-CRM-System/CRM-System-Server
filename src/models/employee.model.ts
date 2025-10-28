import mongoose from 'mongoose';
import type { IEmployee } from "../interfaces/employee.interface.js";
import bcrypt from "bcrypt";

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
  role: {
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

employeeSchema.pre<IEmployee>("save", async function (next) {
  if (this.password === undefined) {
    return next();
  }
  if (this.isModified!("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password!, 10);
  }
  next();
})


const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);
export default Employee;
