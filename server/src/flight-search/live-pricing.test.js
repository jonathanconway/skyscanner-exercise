const fetch = require('node-fetch');
let livePricing = require('./live-pricing');
const config = require('../config');

// mock config
jest.mock('../config', () => ({
  currency: 'GBP',
  currencies: {
    GBP: {
      code: 'GBP',
      symbol: '£'
    }
  },
  apiKey: 'APIKEY',
  skyscannerApi: 'SKYSCANNERAPI'
}));

// mock fetch
const fetchMockConfig = {
        counter: 0,
        pollingStatus: livePricing.STATUS_CODES.CREATED
      },
      LOCATION_TO_POLL = 'LOCATION_TO_POLL';
jest.mock('node-fetch');
fetch
  .mockImplementation(async (url) => {
    // Creating session
    if (url === livePricing.PRICING_URL) {
      return {
        status: livePricing.STATUS_CODES.CREATED,
        headers: {
          get: (header) => header === 'location' ? LOCATION_TO_POLL : undefined
        }
      };
    }

    // Polling
    if (url.includes(LOCATION_TO_POLL)) {
      return {
        json: async () => ({
          Status: 'UpdatesComplete',
          resultFakeProp: `resultFakeValue-${fetchMockConfig.counter++}`
        }),
        status: fetchMockConfig.pollingStatus
      };
    }
  });

describe('live-pricing', () => {
  describe('search', () => {
    describe('with normal status', () => {
      it('queries the live pricing api correctly and returns the results as json', async () => {
        fetchMockConfig.counter = 0;

        const query = {};

        const results = await livePricing.search(query);

        expect(fetch).toHaveBeenNthCalledWith(1,
          livePricing.PRICING_URL,
          expect.objectContaining({
            body: 'country=UK&currency=GBP&locale=en-GB&locationSchema=Sky&apiKey=APIKEY',
            method: 'POST'
          }));
        expect(fetch).toHaveBeenNthCalledWith(2,
          'LOCATION_TO_POLL?apiKey=APIKEY&pageSize=5');

        expect(results).toBeTruthy();
        expect(results).toEqual({
          Status: 'UpdatesComplete',
          resultFakeProp: 'resultFakeValue-0'
        })
      });

      it('returns subsequent results if different', async () => {
        livePricing = require('./live-pricing');
        fetchMockConfig.counter = 0;

        const query = {};
        
        await livePricing.search(query);

        const secondResults = await livePricing.search(query);

        expect(secondResults).toBeTruthy();
        expect(secondResults).toEqual({
          Status: 'UpdatesComplete',
          resultFakeProp: 'resultFakeValue-1'
        })
      });

      it('returns the cached results if same', async () => {
        livePricing = require('./live-pricing');
        fetchMockConfig.counter = 0;

        const query = {};

        await livePricing.search(query);

        fetchMockConfig.pollingStatus = livePricing.STATUS_CODES.NOT_MODIFIED;
        const results = await livePricing.search(query);

        expect(results).toBeTruthy();
        expect(results).toEqual({
          Status: 'UpdatesComplete',
          resultFakeProp: 'resultFakeValue-0'
        });
      });
    });
  });
});

