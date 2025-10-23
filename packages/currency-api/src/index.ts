import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import syncCurrencyRates from './services/ecb.service.js';
import { scheduleDailySync } from './jobs/currency.scheduler.js';
import { CurrencyRate } from './models/currencyRate.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/rates', async (req: Request, res: Response) => {
  try {
    const rates = await CurrencyRate.find().select('currency rate -_id');
    
    const ratesObject = rates.reduce((acc, { currency, rate }) => {
      acc[currency] = rate;
      return acc;
    }, {} as Record<string, number>);

    res.json(ratesObject);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rates.' });
  }
});

const startServer = async () => {
  await connectDB();

  console.log('Performing initial currency rate sync...');
  await syncCurrencyRates();

  scheduleDailySync();

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/rates`);
  });
};

startServer();