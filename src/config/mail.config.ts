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
            <p>Hi ${name},</p>
            <p>Thank you for joining Nexify. We're excited to help you manage your customers and employees efficiently.</p>
            <p>Visit your dashboard: <a href="${process.env.APP_URL!}/">Click here</a></p>
        `
    }),

    forgotPassword: (name: string, link: string) => ({
        subject: "Reset Your Nexify Password",
        html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin-bottom: 8px;">Reset Your Password</h1>
                    <p style="color: #6b7280; font-size: 16px;">We received a request to reset your password</p>
                </div>
                
                <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
                    <p style="color: #374151; font-size: 16px; margin-bottom: 16px;">Hi ${name},</p>
                    <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">You requested to reset your password for your Nexify CRM account. Click the button below to set a new password. This link will expire in 24 hours.</p>
                    
                    <div style="text-align: center;">
                        <a href="${link}" style="display: inline-block; background-color: #4A90E2; color: #ffffff; padding: 12px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 16px;">Reset Password</a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; margin-top: 24px; text-align: center;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="color: #4A90E2; font-size: 12px; text-align: center; word-break: break-all;">${link}</p>
                </div>
                
                <p style="color: #9ca3af; font-size: 14px; text-align: center;">If you didn't request a password reset, you can safely ignore this email.</p>
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">&copy; 2025 Nexify CRM. All rights reserved.</p>
            </div>
        `
    }),

    invite: (sender: string, reciever: string, link: string) => ({
        subject: "Invite to join Nexify",
        html: `
            <p>Hi ${reciever},</p>
            <p>You have been invited by ${sender} to join Nexify. Please click the link below to join:</p>
            <p><a href="${link}">Click here</a></p>
        `
    }),

    teamInvite: (senderName: string, email: string, tempPassword: string, appUrl: string) => ({
        subject: "Welcome to Nexify CRM - You've been invited!",
        html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin-bottom: 8px;">Welcome to Nexify CRM</h1>
                    <p style="color: #6b7280; font-size: 16px;">You've been invited to join the team</p>
                </div>
                
                <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
                    <p style="color: #374151; font-size: 16px; margin-bottom: 16px;">Hi there,</p>
                    <p style="color: #374151; font-size: 16px; margin-bottom: 24px;"><strong>${senderName}</strong> has invited you to join their team on Nexify CRM. Use the credentials below to log in and get started.</p>
                    
                    <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Email Address</p>
                        <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px; font-weight: 500;">${email}</p>
                        
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Temporary Password</p>
                        <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 600; font-family: monospace;">${tempPassword}</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="${appUrl}/login" style="display: inline-block; background-color: #4A90E2; color: #ffffff; padding: 12px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 16px;">Login to Your Account</a>
                    </div>
                </div>
                
                <p style="color: #9ca3af; font-size: 14px; text-align: center;">If you didn't expect this invitation, you can safely ignore this email.</p>
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">&copy; 2025 Nexify CRM. All rights reserved.</p>
            </div>
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
        return new Error(
            "Missing environment variables for mail configuration"
        );
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
