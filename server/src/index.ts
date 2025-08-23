import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import videoRoutes from './routes/videoRoutes';
import brandProfileRoutes from './routes/brandProfileRoutes';
import logger from './utils/logger';
import { initSentry } from './utils/sentry';
import { PrismaClient } from '@prisma/client';

// --- Mock JWT Middleware ---
const mockJwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token === 'valid_token') {
      // In a real app, you'd verify the token and attach the user to the request
      // req.user = decodedToken;
      next();
    } else {
      res.status(401).send('Invalid token');
    }
  } else {
    res.status(401).send('Authorization header missing');
  }
};

// --- Mock Redis Cache Middleware ---
const mockRedisCacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // In a real app, you'd check if the response for this request is in Redis
  // and return the cached response if it exists.
  console.log('Checking cache...');
  next();
};


dotenv.config();
initSentry();

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  // Add your production frontend URL here once deployed
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(helmet());
app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json());

// --- Public route ---
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.send('Video Conversion Backend is running!');
});

// --- Protected routes ---
app.use('/api/v1/videos', mockJwtMiddleware, videoRoutes);
app.use('/api/v1/brand-profile', mockJwtMiddleware, brandProfileRoutes);

// --- Route with caching ---
app.get('/api/v1/insights', mockJwtMiddleware, mockRedisCacheMiddleware, (req, res) => {
    // In a real app, you would fetch data from the database here
    // and then store it in the cache.
    res.json({ message: 'This is a cached response' });
});


// --- Global Error Handler ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
