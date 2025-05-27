import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from '../routes/index.routes.js';
import logger from '../utils/logger.js';
import { loggerMiddleware } from '../middleware/logger.middleware.js';
import { errorHandlingMiddleware } from '../middleware/error-handling.middleware.js';

export default function (app) {
  app.use(cors({
    origin: ['http://localhost:4200', 'https://metal-concerts-frontend-prueba2-tau.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false 
  }));
  
  app.use(loggerMiddleware);
  app.use(morgan('combined', { stream: logger.stream }));
  app.use(express.json());

  app.use('/api/v1', router);

  app.use(errorHandlingMiddleware);
}
