import { Request, Response, NextFunction } from 'express';
import { checkValidationErrors } from '../utils/errors.js';

/**
 * Middleware to check validation errors and throw ValidationError if any exist
 * Use this middleware after your validator middleware to automatically handle validation errors
 * 
 * @example
 * router.post('/route', validateSomething, handleValidationErrors, async (req, res) => {
 *   // Your route logic here - no need to check for validation errors manually
 * });
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    checkValidationErrors(req);
    next();
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};
