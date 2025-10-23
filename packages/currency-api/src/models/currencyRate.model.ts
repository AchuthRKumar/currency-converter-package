import { Schema, model } from 'mongoose';

export interface ICurrencyRate {
  currency: string;
  rate: number;
}

const currencyRateSchema = new Schema<ICurrencyRate>(
  {
    currency: {
      type: String,
      required: true,
      unique: true, 
      uppercase: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CurrencyRate = model<ICurrencyRate>('CurrencyRate', currencyRateSchema);