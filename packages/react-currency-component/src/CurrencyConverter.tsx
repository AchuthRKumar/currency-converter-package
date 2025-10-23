import React from 'react';
import { UseCurrencyConversion } from './useCurrencyConversion';

export interface CurrencyConverterProps {
    value: number;
    apiBaseUrl: string;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ value, apiBaseUrl }) => {
  const { isLoading, error, convertedPrice, displayCurrency } = UseCurrencyConversion({
    basePrice: value,
    apiBaseUrl: apiBaseUrl,
  });

  if (isLoading || error) {
    if (error) {
      console.error(`[react-currency-converter] Error: ${error}`);
    }
    return (
      <span className="currency-converter-fallback">
        {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value)}
      </span>
    );
  }

  return (
    <span className="currency-converter-success">
      {new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: displayCurrency,
      }).format(convertedPrice!)}
    </span>
  );
};
