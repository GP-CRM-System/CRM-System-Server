import type mongoose from "mongoose";

type dealType =
  "Appointment Scheduled" |
  "Qualified To Buy" |
  "Presentation Scheduled" |
  "Decision Maker Bought-In" |
  "Contract Sent" |
  "Closed Won" |
  "Closed Lost";

export default interface IDeal {
  _id: mongoose.Types.ObjectId;
  stage: [{
    type: dealType;
    date: Date;
  }];
  amount: number;
  ownerId: mongoose.Types.ObjectId;
  priority: "Low" | "Medium" | "High";
  contactId?: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
}