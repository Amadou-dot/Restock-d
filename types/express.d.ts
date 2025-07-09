import { IUserDocument } from '../server/src/models/user';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user: IUserDocument | null; // User object or null if not authenticated
      isLoggedIn: boolean; // Indicates if the user is logged in
    }
  }
}

export {};
