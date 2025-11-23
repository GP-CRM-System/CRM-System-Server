// Configuration for sending emails using Nodemailer
// Still needs to be updated

import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { logger } from "./logger.config.js";
dotenv.config({ quiet: true });

export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to Nexify!",
    html: `
            <h2>Welcome to Nexify!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for joining Nexify. We're excited to help you manage your customers and employees efficiently.</p>
            <p>Visit your dashboard: <a href="${process.env.APP_URL!}/">Click here</a></p>
        `
  }),

  forgotPassword: (name: string) => ({
    subject: "Forgot Password",
    html: `
            <h2>Forgot Password</h2>
            <p>Hi ${name},</p>
            <p>You have requested to reset your password. Please click the link below to reset your password:</p>
            <p><a href="${process.env.APP_URL!}/reset-password">Click here</a></p>
        `
  })
};

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<nodemailer.SentMessageInfo | Error> => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_SECURE ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.SMTP_FROM
  ) {
    logger.error("Missing environment variables for mail configuration");
    return new Error("Missing environment variables for mail configuration");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    from: process.env.SMTP_FROM
  });

  try {
    const info = await transporter.sendMail({
      from: `"Nexify Team" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html
    });
    logger.info(`Email sent to ${to}`);
    return info;
  } catch (error: unknown) {
    logger.error(`Error sending email: ${(error as Error).message}`);
    return error;
  }
};
