import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import syncCurrencyRates from './services/ecb.service.js';
import { scheduleDailySync } from './jobs/currency.scheduler.js';
import { CurrencyRate } from './models/currencyRate.model.js';

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = ['http://localhost:5173', 'https://currency-converter-package-currency.vercel.app'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

connectDB().then(() => {
  console.log('Performing initial currency rate sync on startup...');
  syncCurrencyRates();
  scheduleDailySync();
});

app.get('/', (req: Request, res: Response) => {
  res.send('pong');
});

app.get('/rates', async (req: Request, res: Response) => {
  try {
    const rates = await CurrencyRate.find().select('currency rate -_id');

    const ratesObject = rates.reduce(
      (acc, { currency, rate }) => {
        acc[currency] = rate;
        return acc;
      },
      {} as Record<string, number>,
    );

    res.json(ratesObject);
  } catch (error) {
    res.status(500).json({ message: `Error fetching rates.${error}` });
  }
});

export default app;
