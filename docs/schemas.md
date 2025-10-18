# Schemas

## Employees

- Full Name
- Phone No
- Email
- Password
- Role
- Position(?)
- Salary(basic, bonus)
- Notes(?)

## Contacts(Customers/Leads)

- Name
- Email
- Phone
- Contact owner(reference to employee)
- Job title
- lifecycle stage(lead or customer)
- lastUpdatedAt date

## Companies

- Name
- Company Owner(reference to Contact)
- Website/Email
- Industry(?)
- Type(?)
- Address
- No. of Employees(?)
- Description/Notes

## Deals

- Name
- Stage
  - Appointment Scheduled
  - Qualified To Buy
  - Presentation Scheduled
  - Decision Maker Bought-In
  - Contract Sent
  - Closed Won
  - Closed Lost
- Amount
- Close Date
- Deal Owner(reference to Employee)
- Priority(Low, Medium, High)
- Associate with Contact
  - Customer
  - Company

## Support Tickets

- Name
- Status
  - New
  - Waiting on Contact
  - Waiting on Employee
  - Closed
- Description
- Ticket Owner(Reference to Employee)
- Source
  - Chat
  - Email
  - Form
  - Phone
- Priority(Low, Medium, High)
- Associate with Contact
  - Customer
  - Company

## Orders

- Name
- Description
- Price
- Stage
  - Open
  - Processed
  - Shipped
  - Delivered
  - Cancelled
- Associate with Contact
  - Customer
  - Company
- CreatedAt
