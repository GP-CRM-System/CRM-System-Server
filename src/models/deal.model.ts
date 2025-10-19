import mongoose from "mongoose";
import type { IDeal } from "../interfaces/deal.interface.js";

const dealSchema = new mongoose.Schema<IDeal>({
  name: {
    type: String,
    required: true
  },
  stage: [
    {
      type: String,
      required: true
    }
  ],
  amount: {
    type: Number,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employee"
  },
  priority: {
    type: String,
    required: true
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Contact"
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Company"
  }
});

const Deal = mongoose.model<IDeal>("Deal", dealSchema);
export default Deal;
