import { body } from 'express-validator';
import { User } from '../models/user.js';
import { ValidationError } from '../utils/errors.js';

// Security-focused validators - let Mongoose handle most data validation
const validateFirstName = body('firstName').trim().escape(); // Security: prevent XSS

const validateLastName = body('lastName').trim().escape(); // Security: prevent XSS

const validateEmailSignUp = body('email')
  .trim()
  .normalizeEmail({ gmail_remove_dots: false })
  .escape() // Security: prevent XSS
  .custom(async value => {
    // Business logic: check for existing user (can't be done in Mongoose)
    const existingUser = await User.findOne({ email: value }).exec();
    if (existingUser)
      throw new ValidationError('A user with this email already exists');
    return true;
  });

export const validateEmail = body('email')
  .trim()
  .normalizeEmail({ gmail_remove_dots: false })
  .escape(); // Security: prevent XSS

const validatePasswordSignUp = body('password').trim().escape(); // Security: prevent XSS

export const validatePassword = body('password').trim().escape(); // Security: prevent XSS

const validateConfirmPassword = body('confirmPassword')
  .trim()
  .escape() // Security: prevent XSS
  .custom((value, { req }) => {
    // Business logic: cross-field validation (can't be done easily in Mongoose)
    if (value !== req.body.password) {
      throw new ValidationError('Passwords do not match');
    }
    return true;
  });

export const validateSignUp = [
  validateFirstName,
  validateLastName,
  validateEmailSignUp,
  validatePasswordSignUp,
  validateConfirmPassword,
];

export const validateLogin = [validateEmail, validatePassword];

export const validatePasswordReset = [
  validatePasswordSignUp,
  validateConfirmPassword,
  body('token').trim().escape(), // Security: prevent XSS
];
