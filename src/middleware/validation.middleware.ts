import { check } from 'express-validator';

export const userErrorArray = [
  check("name", "Invalid Name")
    .matches(/^[a-zA-Z ]+$/)
    .isLength({ min: 3, max: 50 }),

  check("email", "Invalid Email")
    .isEmail(),

  check("password")
    .optional({ nullable: true })
    .isLength({ min: 8, max: 64 }).withMessage("Invalid Password length")
    .matches(/\d/).withMessage("No digit in Password")
    .matches(/[A-Z]/).withMessage("No Uppercase letter in Password")
    .matches(/[a-z]/).withMessage("No Lowercase letter in Password"),

  check("income", "Income must be a number")
    .isNumeric()
    .custom((value) => value >= 0).withMessage("Income must be non-negative"),

  check("oauth").
    optional({ nullable: true })
    .isIn(['google', null])
    .withMessage("Invalid OAuth provider"),
];

export const expenseErrorArray = [
  check("amount", "Amount must be a Valid number")
    .isNumeric()
    .custom((value) => value >= 0).withMessage("Amount must be non-negative"),

  check("category", "Category must be valid")
    .isIn(['Housing & Utilities', 'Transportation', 'Food & Dining', 'Healthcare', 'Subscriptions & Bills', 'Personal & Lifestyle', 'Financial', 'Education', 'Necessities', 'Miscellaneous']),

  check("description", "Description must be a string")
    .isString()
];

export const budgetErrorArray = [
  check("amount", "Amount must be a Valid number")
    .isNumeric()
    .custom((value) => value >= 0).withMessage("Amount must be non-negative"),

  check("startDate", "Start date must be a valid date")
    .isDate(),

  check("endDate", "End date must be a valid date")
    .isDate(),
];

export const goalErrorArray = [
  check("title", "Title must be a string")
    .isString(),
  
  check("targetAmount", "Target amount must be a valid number")
    .isNumeric()
    .custom((value) => value >= 0).withMessage("Target amount must be non-negative"),

  check("deadline", "Deadline must be a valid date")
    .isDate(),
]