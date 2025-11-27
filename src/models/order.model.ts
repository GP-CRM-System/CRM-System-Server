import mongoose from "mongoose";
import type { IOrder } from "../interfaces/order.interface.js";

const orderSchema = new mongoose.Schema<IOrder>({
  description: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employee"
  },
  stage: [
    {
      stageType: { type: String, required: true, default: "Open" },
      date: { type: Date, required: true, default: new Date() }
    }
  ],
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Contact"
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Employee"
  },
  products: [
    {
      name: String,
      unitPrice: Number,
      quantity: Number
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
