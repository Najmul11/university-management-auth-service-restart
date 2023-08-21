import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config/index';
import UserRoute from './app/modules/users/users.route';
const app: Application = express();

// cors
app.use(cors());
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use('/api/v1/users', UserRoute);

// testing
app.get('/', (req: Request, res: Response) => {
  res.send(`Server running on ${config.port}`);
});

export default app;
