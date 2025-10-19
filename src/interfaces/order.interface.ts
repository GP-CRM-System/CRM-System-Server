import type mongoose from "mongoose";

type stageType = "Open" |
  "Processed" |
  "Shipped" |
  "Delivered" |
  "Cancelled";

export default interface IOrder {
  _id: mongoose.Types.ObjectId;
  description: string;
  price: number;
  ownerId: mongoose.Types.ObjectId;
  stage: [{
    type: stageType;
    date: Date;
  }]
  contactId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
}