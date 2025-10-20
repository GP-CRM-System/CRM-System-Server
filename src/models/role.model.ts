import mongoose from "mongoose";
import type { IRole } from "../interfaces/role.interface.js";

const roleSchema = new mongoose.Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  permissions: [
    {
      permName: {
        type: String,
        required: true
      },
      read: {
        type: Boolean,
        required: true,
        default: false
      },
      write: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  ]
});
roleSchema.index({ name: 1 }, { unique: true });

roleSchema.methods.getPermissions = function () {
  return this.permissions;
}

roleSchema.methods.changeActive = function () {
  this.isActive = !this.isActive;
  this.save();
  return;
};

const Role = mongoose.model<IRole>("Role", roleSchema);
export default Role;
