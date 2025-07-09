import { NextFunction, Request, Response } from 'express';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Access Denied: Unauthenticated user' });
  }
  next();
};
