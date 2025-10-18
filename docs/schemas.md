# Schemas

## Roles

- Name
- isActive
- Permissions:{
  employees:{
    read: true,
    write: true
    }
  }
  keda y3ny

## Employees

- Full Name
- Phone No
- Email
- Password
- Role(reference to role)
- Salary(basic, bonus)
- isActive(t/f)

## Contacts(Customers/Leads)

- Name
- Email
- Phone
- Address
- Job title
- Contact owner(reference to employee)
- lifecycle stage(lead or customer)(+Date)

## Companies

- Name
- Company Owner(reference to Contact)
- Website/Email
- Industry(?)
- Type(?)
- Address
- No. of Employees(?)

## Deals

- Name
- Stage(+Date)
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
- Associate with Contact(turn to customer if lead)
  - Customer
  - Company

## Support Tickets

- Name
- Status(+Dates)
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

- Order ID
- Description
- Price
- Order Owner(reference to Employee)
- Stage(+Date)
  - Open
  - Processed
  - Shipped
  - Delivered
  - Cancelled
- Associate with Contact
  - Customer(if lead convert to customer)
  - Company
