import connectMongoDBSession from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminRouter } from './controllers/admin.js';
import { authRouter } from './controllers/auth.js';
import { cartRouter } from './controllers/cart.js';
import { orderRouter } from './controllers/order.js';
import { productsRouter } from './controllers/products.js';
import { sendErrorResponse } from './utils/errors.js';
// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: Application = express();
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI || '',
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24 * 1, // 1 day
});

// Allow CORS for React app
app.use(
  cors({
    origin: process.env.CLIENT_URL,
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
      sameSite: true, // Adjust as needed
    },
  })
);

app.use('/api', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);
app.use('/api/admin', adminRouter);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.use((err: Error, _req: Request, res: Response, _next: Function) => {
  sendErrorResponse(err, res);
});

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

try {
  // Connect to the database
  await mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/shop'
  );

  server.listen(PORT, () => {
    console.log(`> Server is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Unable to connect to the database:', (error as Error).message);
}

// TODO: update CORS settings for production
