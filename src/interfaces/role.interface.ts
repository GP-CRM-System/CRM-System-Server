import type mongoose from "mongoose";

export default interface IRole {
  _id: mongoose.Types.ObjectId;
  name: string;
  isActive: boolean;
  permissions: [object];
}