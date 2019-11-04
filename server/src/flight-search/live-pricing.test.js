const fetch = require('node-fetch');
const livePricing = require('./live-pricing');

// mock config
jest.mock('../config', () => ({
  country: 'UK',
  locale: 'en-GB',
  locationSchema: 'Sky',
  currency: 'GBP',
  currencies: {
    GBP: {
      code: 'GBP',
      symbol: '£'
    }
  },
  apiKey: 'APIKEY',
  skyscannerApi: 'SKYSCANNERAPI',
  defaultPageSize: 5
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
            body: 'country=UK&locale=en-GB&locationSchema=Sky&currency=GBP&apiKey=APIKEY',
            method: 'POST'
          }));
        expect(fetch).toHaveBeenNthCalledWith(2,
          'LOCATION_TO_POLL?apiKey=APIKEY&pageIndex=0&pageSize=5');

        expect(results).toBeTruthy();
        expect(results).toEqual({
          Status: 'UpdatesComplete',
          resultFakeProp: 'resultFakeValue-0'
        });
      });

      it('passes through all applicable query parameters', async () => {
        fetchMockConfig.counter = 0;
        fetch.mockClear();

        const query = {
          originAirportCode: 'EDI',
          destinationAirportCode: 'LHR',
          outboundDate: "2019-11-04",
          returnDate: "2019-11-04",
          numberOfTravellers: 2,
          currencyCode: 'GBP',
          skip: 5,
          take: 10
        };

        await livePricing.search(query);

        expect(fetch).toHaveBeenNthCalledWith(1,
          livePricing.PRICING_URL,
          expect.objectContaining({
            body: 'country=UK&locale=en-GB&locationSchema=Sky&currency=GBP&apiKey=APIKEY' + 
                  '&originAirportCode=EDI&destinationAirportCode=LHR&outboundDate=2019-11-04' +
                  '&returnDate=2019-11-04&numberOfTravellers=2&currencyCode=GBP&skip=5&take=10',
            method: 'POST'
          }));
        expect(fetch).toHaveBeenNthCalledWith(2,
          'LOCATION_TO_POLL?apiKey=APIKEY&pageIndex=0&pageSize=5');
      });

      it('returns subsequent results if different', async () => {
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

