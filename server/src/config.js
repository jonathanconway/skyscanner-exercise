/* eslint-disable no-console */
// Disabling 'no-console' as it's reasonable for this file to do some logging.


// obtain API key from your Skyscanner contact
const { APIKEY } = process.env;

if (!APIKEY) {
  console.error('APIKEY environment variable missing. Please re-run with `APIKEY=<key> npm run server`');
  process.exit(1);
}

module.exports = {
  country: 'UK',
  locale: 'en-GB',
  locationSchema: 'Sky',
  apiKey: APIKEY,
  skyscannerApi: 'http://partners.api.skyscanner.net/',
  currency: 'GBP',
  currencies: {
    GBP: {
      code: 'GBP',
      symbol: '£'
    }
  },
  defaultPageSize: 5
};
