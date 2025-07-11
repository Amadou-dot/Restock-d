import connectMongoDBSession from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { adminRouter } from './controllers/admin.js';
import { authRouter } from './controllers/auth.js';
import { cartRouter } from './controllers/cart.js';
import { orderRouter } from './controllers/order.js';
import { productsRouter } from './controllers/products.js';
import { sendErrorResponse } from './utils/errors.js';
// Load environment variables
dotenv.config();

const app: Application = express();
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI || '',
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24 * 1, // 1 day
});

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Adjust for cross-origin in production
      httpOnly: true, // Prevent XSS attacks
    },
  })
);

app.use('/api', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);
app.use('/api/admin', adminRouter);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: Function) => {
  sendErrorResponse(err, res);
});

const PORT = process.env.PORT || 3000;

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/shop'
    );
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(
      'Unable to connect to the database:',
      (error as Error).message
    );
  }
};

// For Vercel deployment, export the app
export default app;

// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
  const server = http.createServer(app);

  initializeDatabase().then(() => {
    server.listen(PORT, () => {
      console.log(`> Server is running on http://localhost:${PORT}`);
    });
  });
} else {
  // Initialize database for production
  initializeDatabase();
}
