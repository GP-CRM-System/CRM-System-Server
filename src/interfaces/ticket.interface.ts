import type mongoose from "mongoose";

type statusType = "New" | "Waiting on Contact" | "Waiting on Employee" | "Closed";
type sourceType = "Chat" | "Email" | "Phone" | "Form";

export default interface ITicket {
  _id: mongoose.Types.ObjectId;
  name: string;
  status: [{
    type: statusType;
    date: Date;
  }];
  description: string;
  ownerId: mongoose.Types.ObjectId;
  source: sourceType;
  priority: "Low" | "Medium" | "High";
  contactId?: mongoose.Types.ObjectId;
  employeeId?: mongoose.Types.ObjectId;
}