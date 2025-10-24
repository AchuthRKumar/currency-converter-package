import React from 'react';
import { useCurrency } from './CurrencyContext';

export interface CurrencyConverterProps {
  value: number;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ value }) => {
  const { isLoading, error, rates, userCurrency } = useCurrency();

  if (isLoading || error || !rates) {
    return (
      <span className="currency-converter-fallback">
        {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value)}
      </span>
    );
  }

  const targetRate = rates[userCurrency];
  if (!targetRate) {
    console.warn(`[CurrencyConverter] Rate for ${userCurrency} not found. Falling back to EUR.`);
    return (
      <span className="currency-converter-fallback">
        {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value)}
      </span>
    );
  }

  const convertedPrice = value * targetRate;

  return (
    <span className="currency-converter-success">
      {new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: userCurrency,
      }).format(convertedPrice)}
    </span>
  );
};
