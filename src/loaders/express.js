import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from '../routes/auth.routes.js';

import logger from '../utils/logger.js';
import { loggerMiddleware } from '../middleware/loggerMiddleware.js';
import { errorHandlingMiddleware } from '../middleware/errorHandlingMiddleware.js';

export default function (app) {
  app.use(loggerMiddleware);
  app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));
  app.use(morgan('combined', { stream: logger.stream }));
  app.use(cookieParser());
  app.use(express.json());

  app.use('/api', authRoutes);

  app.use(errorHandlingMiddleware);
}
