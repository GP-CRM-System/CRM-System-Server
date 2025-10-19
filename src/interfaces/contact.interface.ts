import type mongoose from "mongoose";

export default interface IContact {
  name: string;
  email: string;
  phone: string;
  address: string;
  jobTitle: string;
  ownerId: mongoose.Types.ObjectId;
  stage: [{
    name: string;
    date: Date;
  }]
}