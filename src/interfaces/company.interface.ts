import type mongoose from "mongoose";

//fix
type industry = "IT" | "Finance" | "Healthcare" | "Manufacturing";
type companyType = "Public" | "Private";

export interface ICompany {
  _id: mongoose.Types.ObjectId;
  name: string;
  ownerId: mongoose.Types.ObjectId;
  website: string;
  email: string;
  industry: industry;
  type: companyType;
  address: string;
  numberOfEmployees: number;
}