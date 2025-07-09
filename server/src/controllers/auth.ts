import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { json, NextFunction, Request, Response, Router } from 'express';
import { IUserDocument } from '../../../types/User.js';
import {
  validateEmail,
  validateLogin,
  validatePasswordReset,
  validateSignUp,
} from '../middleware/authValidators.js';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';
import { User } from '../models/user.js';
import { DatabaseError, ValidationError } from '../utils/errors.js';
import { sendSuccessResponse } from '../utils/responses.js';
import { sendPasswordResetEmail } from '../utils/sendPasswordResetEmail.js';
import { sendWelcomeEmail } from '../utils/sendWelcomeEmail.js';
declare module 'express-session' {
  interface SessionData {
    user: IUserDocument;
  }
}

const router = Router();
router.use(json());
router.use(handleValidationErrors);
// Check if user is logged in
router.get('/status', async (req: Request, res: Response) => {
  const isLoggedIn = !!req.session.user; // Check if user is attached to session
  return sendSuccessResponse(res, 'Auth status retrieved', { isLoggedIn });
});

// Login endpoint
router.post(
  '/login',
  validateLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password').exec();
      if (!user) throw new ValidationError('Invalid email or password');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new ValidationError('Invalid email or password');
      if (user.resetToken || user.resetTokenExpiration) {
        // Clear reset token if user is logging in
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
      }
      req.session.user = user;
      return sendSuccessResponse(res, 'Login successful', {
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Sign up endpoint
router.post(
  '/signup',
  validateSignUp,
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        cart: {
          items: [],
        },
      }).save();

      if (!newUser)
        throw new DatabaseError(
          'Failed to create user. Please try again later.'
        );
      try {
        sendWelcomeEmail(newUser.email, newUser.firstName);
      } catch (emailError) {
        // Log the error but don't throw it to avoid breaking the signup flow
        // This allows the user to sign up even if the email fails to send
        console.error('Error sending welcome email:', emailError);
      }

      req.session.user = newUser;
      return sendSuccessResponse(res, 'Sign up successful', {
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Logout endpoint
router.post(
  '/logout',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.session.destroy(err => {
        if (err) throw new DatabaseError('Logout failed', err);
      });
      return sendSuccessResponse(res, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/password-reset',
  validateEmail,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    try {
      if (!email) throw new ValidationError('Email is required');
      const token = crypto.randomBytes(32).toString('hex');
      const user = await User.findOne({ email }).exec();
      if (!user) throw new ValidationError('User not found with this email');
      user.resetToken = token;
      user.resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour
      await user.save();
      sendPasswordResetEmail(user.email, user.firstName, user.resetToken);
      return sendSuccessResponse(res, 'Password reset email sent');
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/new-password',
  validatePasswordReset,
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, token } = req.body;
    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: new Date(Date.now()) }, // Check if token is still
      });
      if (!user) throw new ValidationError('Invalid or expired token');
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      user.resetToken = undefined; // Clear reset token
      user.resetTokenExpiration = undefined; // Clear expiration date
      await user.save();
      req.session.user = user; // Attach the updated user to the session
      return sendSuccessResponse(res, 'New password updated successfully', {
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
);
export const authRouter = router;
