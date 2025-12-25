import type { Request, Response } from "express";
import { SContact, type IContact } from "../interfaces/contact.interface.js";
import { logger } from "../config/logger.config.js";
import Contact from "../models/contact.model.js";
import type { IResponse } from "../interfaces/response.interface.js";
import { verifyToken } from "../services/auth.service.js";

export async function createContact(
    req: Request<object, object, IContact>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Contact.write) {
            res.status(401).json({
                message: "Contact creation failed",
                error: "Unauthorized"
            });
            return;
        }

        const contact = await SContact.safeParseAsync(req.body);

        if (contact.success === false) {
            res.status(400).json({
                message: "Invalid fields for contact creation",
                error: JSON.parse(contact.error.message)
            });
            logger.error("Invalid fields for contact creation");
            logger.info(contact.error);
            return;
        }

        const existingContact = await Contact.findOne({
            email: contact.data.email
        });
        if (existingContact) {
            res.status(409).json({
                message: "Contact creation failed",
                error: "Contact with the same email already exists"
            });
            logger.error(
                `Contact with email ${contact.data.email} already exists`
            );
            return;
        }

        const createdContact = await Contact.create(contact.data);
        logger.info(`Created contact ${contact.data.name}`);
        res.status(201).json({
            message: "Contact created",
            data: createdContact
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error creating contact: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function getAllContacts(
    req: Request,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Contact.read) {
            res.status(401).json({
                message: "Contact retrieval failed",
                error: "Unauthorized"
            });
            return;
        }

        const { name, jobTitle, stage } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const filter: { name: object; jobTitle?: object } = {
            name: { $regex: name ?? "", $options: "i" }
        };
        if (jobTitle) {
            filter.jobTitle = { $regex: jobTitle as string, $options: "i" };
        }
        let stageFilter = {};

        if (stage === "Lead") {
            stageFilter = {
                "stage.name": "Lead",
                stage: { $size: 1 }
            };
        } else if (stage === "Customer") {
            stageFilter = { "stage.name": "Customer" };
        }

        const queryFilter = { ...filter, ...stageFilter };
        const total = await Contact.countDocuments(queryFilter);
        const contacts = await Contact.find(queryFilter)
            .skip(skip)
            .limit(limit)
            .populate("owner", "fullName");
        logger.info("Retrieved all contacts");
        res.status(200).json({
            message: "Contacts retrieved",
            data: {
                data: contacts,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error retrieving contacts: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function getOneContact(
    req: Request<{ id: string }>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Contact.read) {
            res.json({
                message: "Contact retrieval failed",
                error: "Unauthorized"
            });
            return;
        }

        const { id } = req.params;
        const contact = await Contact.findById(id).populate("owner");
        if (!contact) {
            res.status(404).json({
                message: "Contact retrieval failed",
                error: "Contact not found"
            });
            logger.warn(`Contact with id ${id} not found`);
            return;
        }
        logger.info(`Retrieved contact with id ${id}`);
        res.status(200).json({ message: "Contact retrieved", data: contact });
        return;
    } catch (err: unknown) {
        logger.error(`Error retreiving contact: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function updateContact(
    req: Request<{ id: string }, object, Partial<IContact>>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Contact.write) {
            res.json({
                message: "Contact update failed",
                error: "Unauthorized"
            });
            return;
        }

        const { id } = req.params;
        const updates = req.body;
        const verifiedUpdates = SContact.partial().safeParse(updates);

        if (verifiedUpdates.success === false) {
            res.status(400).json({
                message: "Contact update failed",
                error: JSON.parse(verifiedUpdates.error.message)
            });
            logger.error("Invalid update fields");
            return;
        }

        const contact = await Contact.findById(id);
        if (!contact) {
            res.status(404).json({
                message: "Contact update failed",
                error: "Contact not found"
            });
            logger.warn(`Contact with id ${id} not found`);
            return;
        }

        await Contact.updateOne({ _id: id }, { $set: verifiedUpdates.data });
        logger.info(`Updated contact with id ${id}`);
        res.status(200).json({ message: "Contact updated", data: contact });
        return;
    } catch (err: unknown) {
        logger.error(`Error updating contact: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function deactivateContact(
    req: Request<{ id: string }>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Contact.delete) {
            res.json({
                message: "Contact deletion failed",
                error: "Unauthorized"
            });
            return;
        }

        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            res.status(404).json({
                message: "Contact deletion failed",
                error: "Contact not found"
            });
            logger.warn(`Contact with id ${id} not found`);
            return;
        }
        logger.info(`Deleted contact with id ${id}`);
        res.status(200).json({ message: "Contact deleted", data: contact });
        return;
    } catch (err: unknown) {
        logger.error(`Error deleting contact: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function updateContactToCustomer(
    req: Request<{ id: string }>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Contact.write) {
            res.json({
                message: "Contact update failed",
                error: "Unauthorized"
            });
            return;
        }

        const { id } = req.params;

        const contact = await Contact.findById(id);
        if (!contact) {
            res.status(404).json({
                message: "Contact update failed",
                error: "Contact not found"
            });
            logger.warn(`Contact with id ${id} not found`);
            return;
        }

        if (contact.stage.length === 2) {
            res.status(400).json({
                message: "Contact update failed",
                error: "Contact already in customer stage"
            });
            logger.warn(`Contact with id ${id} already in customer stage`);
            return;
        }

        contact.stage.push({ name: "Customer", date: new Date() });

        await contact.save();

        logger.info(`Updated contact stage with id ${id}`);
        res.status(200).json({
            message: "Contact stage updated",
            data: contact
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error updating contact stage: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function deleteContact(
    req: Request<{ id: string }>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Contact.delete) {
            res.json({
                message: "Contact deletion failed",
                error: "Unauthorized"
            });
            return;
        }

        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            res.status(404).json({
                message: "Contact deletion failed",
                error: "Contact not found"
            });
            logger.warn(`Contact with id ${id} not found`);
            return;
        }
        logger.info(`Deleted contact with id ${id}`);
        res.status(200).json({ message: "Contact deleted", data: contact });
        return;
    } catch (err: unknown) {
        logger.error(`Error deleting contact: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}
