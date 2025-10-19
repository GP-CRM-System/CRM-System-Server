import mongoose from "mongoose";
import type { ICompany } from "../interfaces/company.interface.js";

const companySchema = new mongoose.Schema<ICompany>({
  name: {
    type: String,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employee"
  },
  website: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  industry: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  numberOfEmployees: {
    type: Number,
    required: false,
    default: 0
  }
});

const Company = mongoose.model<ICompany>("Company", companySchema);
export default Company;
