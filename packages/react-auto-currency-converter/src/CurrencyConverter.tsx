import React from 'react';
import { useCurrency } from './CurrencyContext';

export interface CurrencyConverterProps {
  value: number;
  baseCurrency?: string;
  targetCurrency?: string;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  value,
  baseCurrency = 'EUR',
  targetCurrency,
}) => {
  const { isLoading, error, rates, userCurrency } = useCurrency();

  if (isLoading || error || !rates) {
    return (
      <span className="currency-converter-fallback">
        {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value)}
      </span>
    );
  }

  const finalTargetCurrency = targetCurrency?.toUpperCase() || userCurrency;
  const upperCaseBaseCurrency = baseCurrency.toUpperCase();
  const baseRate = rates[upperCaseBaseCurrency];
  const targetRate = rates[finalTargetCurrency];

  if (!baseRate) {
    console.warn(`[CurrencyConverter] Base currency "${baseCurrency}" not found. Falling back to EUR display.`);
    return (
      <span className="currency-converter-fallback">
        {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value)}
      </span>
    );
  }

  if (!targetRate) {
    console.warn(
      `[CurrencyConverter] Rate for target currency "${finalTargetCurrency}" not found. Falling back to EUR.`,
    );
    return (
      <span className="currency-converter-fallback">
        {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value)}
      </span>
    );
  }

  const valueInEur = value / baseRate;
  const convertedPrice = valueInEur * targetRate;

  return (
    <span className="currency-converter-success">
      {new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: finalTargetCurrency,
      }).format(convertedPrice)}
    </span>
  );
};
