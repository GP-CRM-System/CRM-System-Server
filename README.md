# CRM System Server

Backend repository for the Nexify CRM System. This server provides a robust API for managing companies, contacts, deals, employees, orders, roles, and tickets.

## Project Idea

The Nexify CRM System is designed to streamline customer relationship management for businesses. It allows organizations to track interactions with clients, manage sales pipelines (deals), handle customer support tickets, and organize employee roles and permissions. The backend is built with performance, security, and scalability in mind.

## Technologies Used

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: Passport.js (Google OAuth 2.0), JWT (JSON Web Tokens)
- **Documentation**: Swagger UI
- **Logging**: Pino

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

## Features

- **Role-Based Access Control (RBAC)**: Granular permissions for every resource.
- **Authentication**: Secure login via JWT and Google OAuth.
- **Data Validation**: Robust schema validation using Zod.
- **API Documentation**: Integrated Swagger UI for easy API exploration.
- **Logging**: Structured logging for monitoring and debugging.

## Future Work

- [ ] Implement advanced filtering and pagination for all list endpoints.
- [ ] Add unit and integration tests (Jest).
- [ ] Implement websocket support for real-time updates (e.g., new tickets).
- [ ] Dockerize the application for easy deployment.
