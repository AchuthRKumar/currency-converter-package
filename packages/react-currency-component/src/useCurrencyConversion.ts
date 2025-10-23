import { useState, useEffect } from 'react';
import { countryToCurrencyMap } from './utils/countryToCurrencyMap';

interface UseCurrencyConversionProps {
    basePrice: number;
    apiBaseUrl: string;
}

interface ConversionResult {
    error: string | null;
    isLoading: boolean;
    convertedPrice: number | null;
    displayCurrency: string;
}

let ratesCache: Record<string, number> | null = null;

export const UseCurrencyConversion = ({
    basePrice,
    apiBaseUrl
}: UseCurrencyConversionProps): ConversionResult => {
    const [conversionResult, setConversionResult] = useState<ConversionResult>({
        isLoading: true,
        error: null,
        convertedPrice: null,
        displayCurrency: 'EUR',
    });

    useEffect(() => {
        const performConversion = async () => {
            try {
                // --- 1. Fetch Currency Rates (with Caching) ---
                if (!ratesCache) {
                    console.log('Fetching fresh currency rates...');
                    const ratesResponse = await fetch(`${apiBaseUrl}/api/rates`);
                    if (!ratesResponse.ok) {
                        throw new Error('Failed to fetch currency rates.');
                    }
                    ratesCache = await ratesResponse.json();
                }

                // --- 2. Detect User's Location via IP ---
                const locationResponse = await fetch(`https://ip-api.com/json/?fields=countryCode`);
                if (!locationResponse.ok) {
                    throw new Error('Failed to determine location.');
                }
                const locationData = await locationResponse.json();
                const countryCode = locationData.countryCode;

                const targetCurrency = countryToCurrencyMap[countryCode] || 'EUR'; 

                const euroRate = ratesCache!['EUR'];
                const targetRate = ratesCache![targetCurrency];

                if (!targetRate) {
                    throw new Error(`Rate for currency ${targetCurrency} not available.`);
                }

                const finalPrice = basePrice * targetRate;

                setConversionResult({
                    isLoading: false,
                    error: null,
                    convertedPrice: finalPrice,
                    displayCurrency: targetCurrency,
                });

            } catch (err: any) {
                console.error('Currency conversion failed:', err.message);
                setConversionResult({
                    isLoading: false,
                    error: err.message,
                    convertedPrice: null,
                    displayCurrency: 'EUR', 
                });
            }
        };

        performConversion();
    }, [basePrice, apiBaseUrl]);

    return conversionResult;
}
