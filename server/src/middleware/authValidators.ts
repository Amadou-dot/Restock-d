import { body } from 'express-validator';
import { User } from '../models/user.js';
import { ValidationError } from '../utils/errors.js';

// Security-focused validators - let Mongoose handle most data validation
const validateFirstName = body('firstName').trim().escape();

const validateLastName = body('lastName').trim().escape();

const validateEmailSignUp = body('email')
  .trim()
  .normalizeEmail({ gmail_remove_dots: false })
  .escape()
  .custom(async value => {
    // Business logic: check for existing user (can't be done in Mongoose)
    const existingUser = await User.findOne({ email: value }).exec();
    if (existingUser)
      throw new ValidationError('A user with this email already exists');
    return true;
  });

export const validateEmail = body('email')
  .trim()
  .isEmail()
  .normalizeEmail({ gmail_remove_dots: false })
  .escape()
  .withMessage('Invalid email format');

const validatePasswordSignUp = body('password')
  .trim()
  .escape()
  .custom(async value => {
    if (!value) throw new ValidationError('Password is required');
    const hasUppercase = /[A-Z]/.test(value);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(value);
    if (!hasUppercase)
      throw new ValidationError(
        'Password must contain at least one uppercase letter'
      );
    if (!hasSpecialChar)
      throw new ValidationError(
        'Password must contain at least one special character'
      );
    return true;
  });

export const validatePassword = body('password').trim().escape();

const validateConfirmPassword = body('confirmPassword')
  .trim()
  .escape()
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
  body('token').trim().escape(),
];
