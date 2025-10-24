import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { countryToCurrencyMap } from './utils/countryToCurrencyMap';

interface ICurrencyContext {
  isLoading: boolean;
  error: string | null;
  rates: Record<string, number> | null;
  userCurrency: string;
}

const CurrencyContext = createContext<ICurrencyContext | undefined>(undefined);

export interface CurrencyProviderProps {
  apiBaseUrl: string;
  children: ReactNode;
}

const PUBLIC_API_URL = 'https://currency-converter-package-currency.vercel.app';

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ apiBaseUrl = PUBLIC_API_URL, children }) => {
  const [contextValue, setContextValue] = useState<ICurrencyContext>({
    isLoading: true,
    error: null,
    rates: null,
    userCurrency: 'EUR',
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const [ratesResponse, locationResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/rates`),
          fetch(`http://ip-api.com/json/?fields=countryCode`),
        ]);

        if (!ratesResponse.ok) throw new Error('Failed to fetch currency rates.');
        if (!locationResponse.ok) throw new Error('Failed to determine location.');

        const ratesData = await ratesResponse.json();
        const locationData = await locationResponse.json();

        const countryCode = locationData.countryCode;
        const targetCurrency = countryToCurrencyMap[countryCode] || 'EUR';

        setContextValue({
          isLoading: false,
          error: null,
          rates: ratesData,
          userCurrency: targetCurrency,
        });
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }

        console.error('[CurrencyProvider] Initialization failed:', errorMessage);
        setContextValue({
          isLoading: false,
          error: errorMessage,
          rates: null,
          userCurrency: 'EUR',
        });
      }
    };

    initialize();
  }, [apiBaseUrl]);

  return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): ICurrencyContext => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
