import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    index: true,
    trim: true,
    minLength: 3,
    maxLength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 5,
    maxLength: 50
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // roles: {
  //   type: [Role]
  // },
  salary: {
    type: Number,
    min: 0
  }

})