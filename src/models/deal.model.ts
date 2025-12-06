import mongoose from "mongoose";
import type { IDeal } from "../interfaces/deal.interface.js";

const dealSchema = new mongoose.Schema<IDeal>({
  name: { type: String, required: true },
  stage: [
    {
      name: {
        type: String,
        required: true,
        enum: [
          "Appointment Scheduled",
          "Qualified To Buy",
          "Presentation Scheduled",
          "Decision Maker Bought-In",
          "Contract Sent",
          "Closed Won",
          "Closed Lost"
        ]
      },
      date: { type: Date, required: true, default: Date.now }
    }
  ],
  amount: { type: Number, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employee"
  },
  priority: { type: String, required: true },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Contact"
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Company"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Deal = mongoose.model<IDeal>("Deal", dealSchema);
export default Deal;
