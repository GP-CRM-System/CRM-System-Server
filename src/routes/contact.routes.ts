import express from "express";
import {
  createContact,
  deactivateContact,
  getAllContacts,
  getOneContact,
  updateContact,
  updateContactToCustomer
} from "../controllers/contact.controller.js";

const contactRouter = express.Router();

contactRouter.route("/").get(getAllContacts).post(createContact);

contactRouter
  .route("/:id")
  .get(getOneContact)
  .put(updateContact)
  .delete(deactivateContact);

contactRouter.put("/stage/:id", updateContactToCustomer);

export default contactRouter;
