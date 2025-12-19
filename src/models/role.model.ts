import mongoose from "mongoose";
import type { IRole } from "../interfaces/role.interface.js";

const roleSchema = new mongoose.Schema<IRole>({
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, required: true, default: true },
    Company: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
    },
    Employee: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
    },
    Contact: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
    },
    Deal: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
    },
    Role: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
    },
    Order: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
    },
    Ticket: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

roleSchema.methods.getPermissions = function () {
    return this.permissions;
};

roleSchema.methods.changeActive = function () {
    this.isActive = !this.isActive;
    this.save();
    return;
};

const Role = mongoose.model<IRole>("Role", roleSchema);
export default Role;
