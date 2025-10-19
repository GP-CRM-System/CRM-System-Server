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
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employee"
  },
  stage: [
    {
      name: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      }
    }
  ]
});

const Contact = mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
