// Custom error classes for better error handling across the application

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ObjectId } from 'mongodb';

export class ProductError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'ProductError';
  }
}

export class ValidationError extends ProductError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ProductError {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ProductError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class DatabaseError extends ProductError {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

export const validateUserId = (userId: string) => {
  if (!userId.toString().trim()) {
    throw new ValidationError('User ID is required and cannot be empty');
  }
  if (!ObjectId.isValid(userId)) {
    throw new ValidationError('Invalid user ID format');
  }
};

export const validateProductId = (productId: string) => {
  if (!productId.toString().trim()) {
    throw new ValidationError('Product ID is required and cannot be empty');
  }
  if (!ObjectId.isValid(productId)) {
    throw new ValidationError('Invalid product ID format');
  }
};

/**
 * Checks for validation errors and throws a ValidationError if any exist
 * @param req - Express request object
 * @throws ValidationError if validation errors are found
 */
export const checkValidationErrors = (req: Request): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(
      errors
        .array()
        .map(err => err.msg)
        .join(', ')
    );
  }
};

export const sendErrorResponse = (
  error: unknown,
  res: Response,
  context = 'handling request'
) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: `Validation error`,
      error: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      message: `Resource not found`,
      error: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    return res.status(401).json({
      message: `Unauthorized access`,
      error: error.message,
    });
  }

  if (error instanceof DatabaseError) {
    return res.status(500).json({
      message: `Database error`,
      error: error.message,
      originalError: error.originalError?.message,
    });
  }

  return res.status(500).json({
    message: `Unexpected error while ${context}`,
    error: (error as Error).message,
  });
};
