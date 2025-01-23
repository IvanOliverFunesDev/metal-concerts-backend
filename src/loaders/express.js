import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from '../routes/auth.routes.js';
import concertRoutes from '../routes/concert.routes.js';
import userRoutes from '../routes/user.routes.js';
import subscriptionRoutes from '../routes/subscription.routes.js';
import bandRoutes from '../routes/band.routes.js';

import logger from '../utils/logger.js';
import { loggerMiddleware } from '../middleware/logger.middleware.js';
import { errorHandlingMiddleware } from '../middleware/error-handling.middleware.js';

export default function (app) {
  app.use(loggerMiddleware);
  app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));
  app.use(morgan('combined', { stream: logger.stream }));
  app.use(cookieParser());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/concerts', concertRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/subscriptions', subscriptionRoutes);
  app.use('/api/bands', bandRoutes);

  app.use(errorHandlingMiddleware);
}
