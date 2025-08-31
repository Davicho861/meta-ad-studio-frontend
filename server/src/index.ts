import express from 'express';
import client from 'prom-client';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env.server' });
import authRoutes from './routes/authRoutes';
import apiRoutes from './routes/api';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app, prisma, server };
