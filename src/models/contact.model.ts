import mongoose from "mongoose";

import type { IContact } from "../interfaces/contact.interface.js";

const contactSchema = new mongoose.Schema<IContact>({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  jobTitle: {
    type: String,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employee"
  },
  stage: {
    type: [
      {
        name: {
          type: String,
          enum: ["Lead", "Customer"]
        },
        date: {
          type: Date
        }
      }
    ],
    default: [{ name: "Lead", date: new Date() }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Contact = mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
