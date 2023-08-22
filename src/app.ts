import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import config from './config/index';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import httpStatus from 'http-status';

import { routes } from './app/routes';

const app: Application = express();

// cors
app.use(cors());
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use('/api/v1', routes);

// testing
app.get('/', (req: Request, res: Response) => {
  res.send(`Server running on ${config.port}`);
});

// middlewares
app.use(globalErrorHandler);

// handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
