import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { CurrencyRate, ICurrencyRate } from '../models/currencyRate.model.js';

//Official URL for ECB rates
const ECB_RATES_URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

//to fetch the ECB rates in XML
const fetchRatesXML = async (): Promise<string> => {
  try {
    const response = await axios.get(ECB_RATES_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching XML data from ECB:', error);
    throw new Error('Failed to fetch ECB rates XML.');
  }
};

//Parse the rates from the XML
const parseAndTransformRates = async (xmlData: string): Promise<ICurrencyRate[]> => {
  try {
    const parsedXml = await parseStringPromise(xmlData);
    
    const ratesData = parsedXml['gesmes:Envelope']['Cube'][0]['Cube'][0]['Cube'];

    const transformedRates: ICurrencyRate[] = ratesData.map((rateEntry: any) => ({
      currency: rateEntry.$.currency,
      rate: parseFloat(rateEntry.$.rate),
    }));

    transformedRates.push({ currency: 'EUR', rate: 1.0 });

    return transformedRates;
  } catch (error) {
    console.error('Error parsing XML data:', error);
    throw new Error('Failed to parse ECB rates XML.');
  }
};

//Save rates to DB
const saveRatesToDB = async (rates: ICurrencyRate[]): Promise<void> => {
  if (!rates || rates.length === 0) {
    console.log('No rates to save.');
    return;
  }

  try {
    const bulkOps = rates.map(rate => ({
      updateOne: {
        filter: { currency: rate.currency },
        update: { $set: rate },
        upsert: true, 
      },
    }));

    const result = await CurrencyRate.bulkWrite(bulkOps);
    console.log('Database updated successfully.', {
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error saving rates to the database:', error);
    throw new Error('Failed to save rates to DB.');
  }
};

const syncCurrencyRates = async () => {
  console.log('Starting currency rate synchronization...');
  try {
    const xmlData = await fetchRatesXML();
    const transformedRates = await parseAndTransformRates(xmlData);
    await saveRatesToDB(transformedRates);
    console.log('Synchronization completed successfully.');
  } catch (error) {
    console.error('Synchronization failed:', error);
  }
};

export default syncCurrencyRates;