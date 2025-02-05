import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from '../routes/index.routes.js';
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

  app.use('/api/v1', router);

  app.use(errorHandlingMiddleware);
}
