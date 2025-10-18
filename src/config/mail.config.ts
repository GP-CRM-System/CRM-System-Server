// Configuration for sending emails using Nodemailer
// Still needs to be updated

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ quiet: true });

const mailConfig = {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT!),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!
    },
    from: process.env.SMTP_FROM!
};


export const emailTemplates = {
    welcome: (firstName: string) => ({
        subject: 'Welcome to WalletWatch!',
        html: `
            <h2>Welcome to WalletWatch!</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for joining WalletWatch. We're excited to help you manage your Budgets and expenses more efficiently.</p>
            <p>Visit your dashboard: <a href="${process.env.APP_URL!}/">Click here</a></p>
        `
    }),

    overspending: (firstName: string, percentage: number, amount: number) => ({
        subject: 'Budget Overspending Alert',
        html: `
            <h2>Budget Overspending Alert</h2>
            <p>Hi ${firstName},</p>
            <p>We noticed that you have overspent your budget by ${percentage.toFixed(2)}%.</p>
            <p>You have spent a total of $${amount.toFixed(2)}.</p>
            <p>Please review your budget and expenses to avoid further overspending.</p>
        `
    }),
    reminder: () => ({
        subject: 'Budget Reminder',
        html: `<p>Reminder: Don’t forget to log today’s expenses in your Smart Budget Tracker.</p>  
<p>Keeping your expenses updated helps you stay within your budget and track your saving goals.</p>`
    }),
    report: () => ({
        subject: `Monthly Budget Report`,
        html: `<p>Hi,</p>
        <p>Here is your monthly budget report:</p>
        `
    })

};

export const sendEmail = async (to: string, subject: string, html: string): Promise<nodemailer.SentMessageInfo> => {
    const transporter = nodemailer.createTransport(mailConfig);
    const info = await transporter.sendMail({
        from: `"WalletWatch" <${mailConfig.from}>`,
        to,
        subject,
        html
    });
    return info;
};