import type mongoose from "mongoose";

export default interface IEmployee {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  roleId: mongoose.Types.ObjectId;
  salary: number;
  isActive: boolean;
}