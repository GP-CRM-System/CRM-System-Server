# Schemas

## Auth

### Register Admin

- fullName: string, 3-50 characters, only letters and spaces
- phone: string, 7-14 characters, only numbers
- email: string, valid email
- password: string, 8-64 characters

### Login

- email: string, valid email
- password: string, 8-64 characters

## Roles

### Create Role / Update Role

- name: string, 3-50 characters, only letters and spaces
- Company: object {
  write: boolean
  read: boolean
  delete: boolean
  }
- Employee: object {
  write: boolean
  read: boolean
  delete: boolean
  }
- Contact: object {
  write: boolean
  read: boolean
  delete: boolean
  }
- Deal: object {
  write: boolean
  read: boolean
  delete: boolean
  }
- Role: object {
  write: boolean
  read: boolean
  delete: boolean
  }
- Order: object {
  write: boolean
  read: boolean
  delete: boolean
  }
- Ticket: object {
  write: boolean
  read: boolean
  delete: boolean
  }

## Employees

### Create Employee / Update Employee

- fullName: string, 3-50 characters, only letters and spaces
- phone: string, 7-14 characters, only numbers
- email: string, valid email
- password: string, 8-64 characters
- role: string, valid role id

```json
{
    "fullName": "John Doe",
    "phone": "1234567890",
    "email": "john.doe@example.com",
    "password": "password",
    "role": "64b8d5d5d5d5d5d5d5d5d5d5"
}
```

## Contacts

### Create Contact / Update Contact

- name: string, 3-50 characters, only letters and spaces
- email: string, valid email, can be null
- phone: string, 7-14 characters, only numbers, can be null
- address: string, 3-100 characters, only letters, numbers and spaces, can be null
- jobTitle: string, 3-50 characters, only letters and spaces, can be null
- owner: string, valid employee id
- stage: array of objects { name: "Lead" | "Customer", date: date }
- createdAt: date
- updatedAt: date

## Companies

### Create Company / Update Company

- name: string, 3-50 characters, only letters and spaces
- owner: string, valid employee id
- contact: string, valid contact id
- website: string, valid url, can be null
- email: string, valid email, can be null
- industry: string, valid industry, optional
- type: string, "Prospect" | "Partner" | "Reseller" | "Vendor" | "Other", optional
- address: string, 3-100 characters, only letters, numbers and spaces, can be null
- numberOfEmployees: number, can be null
- createdAt: date
- updatedAt: date

## Deals

### Create Deal / Update Deal

- name: string, 3-50 characters, only letters and spaces
- stage: array of objects { name: "Appointment Scheduled" | "Qualified To Buy" | "Presentation Scheduled" | "Decision Maker Bought-In" | "Contract Sent" | "Closed Won" | "Closed Lost", date: date }
- amount: number, greater than 0
- owner: string, valid employee id
- priority: string, "Low" | "Medium" | "High"
- contact: string, valid contact id
- company: string, valid company id
- createdAt: date
- updatedAt: date

## Orders

### Create Order / Update Order

- description: string, 3-100 characters, only letters, numbers and spaces
- owner: string, valid employee id
- stage: array of objects { name: "Open" | "Processed" | "Shipped" | "Delivered" | "Cancelled", date: date }
- contact: string, valid contact id
- employee: string, valid employee id
- products: array of objects { name: string, unitPrice: number, quantity: number }

## Tickets

### Create Ticket / Update Ticket

- name: string, 3-50 characters, only letters and spaces
- status: array of objects { name: "New" | "Waiting on Contact" | "Waiting on Employee" | "Closed", date: date }
- description: string, 3-100 characters, only letters, numbers and spaces
- owner: string, valid employee id
- priority: string, "Low" | "Medium" | "High"
- contact: string, valid contact id
- source: string, "Chat" | "Email" | "Phone" | "Form"
- createdAt: date
- updatedAt: date
