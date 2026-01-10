# CRM System Server

Backend repository for the Nexify CRM System. This server provides a robust, RESTful API for managing companies, contacts, deals, employees, orders, roles, and tickets. It is designed to streamline customer relationship management for businesses by tracking interactions, managing sales pipelines, and handling support tickets with high performance and security.

## Project Idea

The Nexify CRM System is a comprehensive solution designed to empower organizations to manage their customer relationships effectively. Beyond simple contact management, it offers a full suite of tools to:

- **Track Interactions**: Keep a detailed history of all communications with clients.
- **Manage Sales Pipelines**: Visualize and progress deals through customizable stages.
- **Handle Support**: Efficiently manage and resolve customer support tickets.
- **Role-Based Access**: Securely manage employee permissions and access levels.
- **Analyze Performance**: Gain insights into revenue trends, lead conversions, and product performance.

The backend is architected with scalability and security at its core, utilizing modern technologies to ensure a reliable and fast experience.

## Key Features

- **Role-Based Access Control (RBAC)**: Granular permissions for every resource (Read, Write, Delete) ensuring data security.
- **Advanced Authentication**:
  - **Google OAuth 2.0**: Secure and convenient login using Google accounts.
  - **JWT (JSON Web Tokens)**: Stateless authentication for API requests.
- **Advanced Analytics**:
  - **Revenue Trends**: Visualize monthly revenue data.
  - **Lead Conversions**: Track how leads are converting into customers.
  - **Product Performance**: Analyze top-performing products.
  - **Ticket Statuses**: Monitor the distribution of support tickets.
- **Data Validation**: Robust schema validation using Zod to ensure data integrity.
- **API Documentation**: Integrated Swagger UI for easy API exploration and testing.
- **Logging**: Structured logging with Pino and Morgan for monitoring and debugging.

## Technologies Used

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: Passport.js (Google OAuth 2.0), JWT
- **Documentation**: Swagger UI
- **Logging**: Pino, Morgan

## NPM Modules

Key dependencies used in this project:

- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling tool.
- `typescript`: Typed superset of JavaScript.
- `zod`: TypeScript-first schema declaration and validation library.
- `passport`, `passport-google-oauth20`: Authentication middleware.
- `jsonwebtoken`: For generating and verifying JWTs.
- `bcrypt`: Library for hashing passwords.
- `pino`, `pino-pretty`: Fast and low-overhead logger.
- `helmet`: Helps secure Express apps by setting various HTTP headers.
- `cors`: Middleware to enable Cross-Origin Resource Sharing.
- `swagger-ui-express`: Auto-generated API documentation.
- `nodemailer`: Send emails from Node.js.
- `prettier` : Code formatter.
- `eslint` : JavaScript and TypeScript linter.

## Folder Structure

```bash
src/
├── config/         # Configuration files (DB, Logger, Passport, Swagger)
├── controllers/    # Request handlers for each resource
├── interfaces/     # TypeScript interfaces for models
├── middleware/     # Custom middleware (Auth, Error handling)
├── models/         # Mongoose schemas and models
├── routes/         # API route definitions
├── services/       # Business logic and helper services
└── app.ts          # Application entry point
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configurations
PORT=4650
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173, http://localhost:4650

# JWT Secret Keys
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# MongoDB Connection URI
MONGODB_URI=mongodb://localhost:27017/nexify

# Email Configuration
SMTP_HOST=smtp.host.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@host.com
SMTP_PASS=password
SMTP_FROM=username@gmail.com
APP_URL=http://localhost:4650

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4650/auth/google/callback
```

## Database Schemas

The application uses the following Mongoose models:

- **Company**: Stores company details (`name`, `website`, `industry`, `owner`, etc.).
- **Contact**: Individual contacts associated with companies (`name`, `phone`, `email`, `stage`, `owner`).
- **Deal**: Sales opportunities (`name`, `stage`, `amount`, `priority`, `contact`, `company`).
- **Employee**: System users (`fullName`, `email`, `password`, `role`, `salary`, `isActive`).
- **Order**: Customer orders (`description`, `price`, `stage`, `contact`, `employee`).
- **Role**: RBAC roles defining permissions for each resource (`read`, `write`, `delete`).
- **Ticket**: Support tickets (`name`, `status`, `description`, `priority`, `contact`, `owner`).

## API Endpoints

Base URL: `/api/v1`

### Authentication

- `POST /auth/register`: Register a new admin.
- `POST /auth/login`: Login with email and password.
- `GET /auth/google`: Initiate Google OAuth login.
- `GET /auth/google/callback`: Google OAuth callback.

### Analytics

- `GET /analytics/cards`: Get summary cards data.
- `GET /analytics/revenue`: Get monthly revenue trends.
- `GET /analytics/tickets`: Get ticket status distribution.
- `GET /analytics/products`: Get product performance data.
- `GET /analytics/leads`: Get lead conversion rates.

### Resources

All resource routes are protected by `isAuthenticated` middleware.

- **Companies** (`/companies`)
  - `GET /`, `POST /`
  - `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Contacts** (`/contacts`)
  - `GET /`, `POST /`
  - `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Deals** (`/deals`)
  - `GET /`, `POST /`
  - `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Employees** (`/employees`)
  - `GET /`, `POST /`
  - `GET /:id`, `PUT /:id`, `DELETE /:id` (Deactivate)
- **Orders** (`/orders`)
  - `GET /`, `POST /`
  - `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Roles** (`/roles`)
  - `GET /`, `POST /`
  - `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Tickets** (`/tickets`)
  - `GET /`, `POST /`
  - `GET /:id`, `PUT /:id`, `DELETE /:id`

### Miscellaneous

- `GET /health`: Check server health status.

## Database Seeding 🌱

Quickly populate your database with realistic test data using our powerful seeding scripts!

### Quick Start

```bash
# Small dataset (290 records) - Perfect for development
npm run seed:small

# Medium dataset (3,020 records) - Great for testing
npm run seed:medium

# Large dataset (5,025 records) - Ideal for demos
npm run seed:massive

# Extreme dataset (59,050 records) - For load testing
npm run seed:extreme
```

### What Gets Generated

- ✅ **Roles** with granular permissions
- ✅ **Employees** (default password: `password123`)
- ✅ **Contacts** with social media profiles
- ✅ **Companies** with full details and history
- ✅ **Deals** with multi-stage progression
- ✅ **Orders** with multiple products
- ✅ **Tickets** with resolution tracking

### Available Scripts

| Script | Records | Use Case | Time |
|--------|---------|----------|------|
| `npm run seed` | ~70 | Quick testing | ~5s |
| `npm run seed:small` | ~290 | Development | ~10s |
| `npm run seed:medium` | ~3,020 | Integration tests | ~30s |
| `npm run seed:large` | ~5,025 | Demos & QA | ~45s |
| `npm run seed:massive` | ~5,025 | Performance testing | ~45s |
| `npm run seed:extreme` | ~59,050 | Load testing | ~5m |

### Features

- 📊 **Realistic data** using Faker.js
- 🔗 **Proper relationships** between all entities
- 📅 **Historical data** (up to 3 years old)
- 🎯 **Stage progressions** for deals, orders, and tickets
- 💬 **Interaction histories** for companies and contacts
- 🌐 **Social media profiles** for contacts
- 💰 **Multiple products** per order
- ⚡ **Optimized batch insertion** for large datasets

### Documentation

- 📖 **Full Documentation**: See [docs/SEEDING.md](./docs/SEEDING.md)
- ⚡ **Quick Reference**: See [docs/SEEDING-QUICK.md](./docs/SEEDING-QUICK.md)
- 📋 **Summary**: See [docs/SEEDING-SUMMARY.md](./docs/SEEDING-SUMMARY.md)

---

## Manual Dummy Data (Alternative)

If you prefer to manually add data, you can use the JSON files in `docs/test-database`.

**Instructions:**

1. Open **MongoDB Compass**.
2. Connect to your database (e.g., `mongodb://localhost:27017/nexify`).
3. Navigate to a collection.
4. Click **Add Data** -> **Insert Document**.
5. Switch to the **JSON** view (the `{}` icon).
6. Paste the array of objects and click **Insert**.

## How to Run

1. **Install Dependencies**:

    ```bash
    npm install
    ```

2. **Set up Environment**:
    Copy `.env.example` to `.env` and fill in the required values.

3. **Run in Development**:

    ```bash
    npm run dev:start   # Run with tsx
    # OR
    npm run dev:watch   # Run with watch mode
    ```

4. **Build and Run Production**:

    ```bash
    npm run dev:build
    npm run prod:start
    ```

## Future Work

- [ ] **Redis Caching**: Integrate Redis to cache frequent API responses and improve performance.(maybe idk)
- [ ] **File Uploads**: Support for uploading avatars and document attachments (e.g., using AWS S3 or Multer).
- [ ] **Enhanced Email Notifications**: Create HTML email templates for system alerts and updates.
- [ ] **Audit Logs**: Track critical system actions for security and compliance.(maybe idk)
- [ ] **Multi-tenancy**: Support multiple companies or organizations with separate databases and user accounts.
- [ ] **AI Chatbot**: Implement an AI-powered chatbot for customer support and lead generation.
- [ ] **Real-time Notifications**: Implement WebSockets for instant updates on deals, tickets, and other critical events.
- [ ] **Customizable Dashboards**: Allow users to personalize their dashboards with relevant widgets and metrics.(in frontend b2a)
- [ ] **Third-Party Integrations**: Connect with external services like SMS gateways, payment processors.
- [ ] **Automated Email Notifications**: Implement automated email notifications for system alerts and updates.(not really)
- [ ] **Advanced Reporting**: Develop more sophisticated reporting tools with custom report generation and scheduling.
- [ ] **More Sophisticated Analytics**: Implement more sophisticated analytics tools to track user behavior and system performance.
