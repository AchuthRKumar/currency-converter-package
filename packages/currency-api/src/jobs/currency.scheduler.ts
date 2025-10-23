import cron from 'node-cron';
import syncCurrencyRates from '../services/ecb.service.js';

/**
 * Initializes the scheduled job.
 * The ECB updates its rates around 16:00 CET. We'll run our job shortly after.
 * This cron schedule runs at 16:15 (4:15 PM) UTC every day.
 */
export const scheduleDailySync = () => {
  console.log('Scheduling daily currency sync job...');
  cron.schedule('15 16 * * *', syncCurrencyRates, {
    timezone: 'UTC',
  });
};
