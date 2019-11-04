const flightSearch = require('./flight-search');
const flightSearchHandlers = require('./flight-search.handlers');

// mock live-pricing
jest.mock('./live-pricing');

// mock flight-search
jest.mock('./flight-search');
flightSearch.mockImplementation(() => async () => {});

describe('flightSearchHandlers', () => {
  describe('getFlightSearchHandler', () => {
    const defaultQuery = {
            originAirportCode: 'LGW',
            destinationAirportCode: 'EDI',
            outboundDate: '2010-01-01',
            returnDate: '2010-01-02',
            take: 5,
            currencyCode: 'GBP'
          },
          mockSend = jest.fn(),
          mockRes = {
            json: jest.fn(),
            status: jest.fn(() => ({ send: mockSend }))
          };

    it('validates airport codes', async () => {
      [
        'originAirportCode',
        'destinationAirportCode'
      ].forEach(async (prop) => {
        [
          ['llllll', false],
          ['lllll', false],
          ['LGW1', false],
          ['LGW', true],
        ].forEach(async ([ airportCode, shouldBeValid ]) => {
          const query = {
            ...defaultQuery,
            [prop]: airportCode
          };

          await flightSearchHandlers.getFlightSearchHandler({ query }, mockRes);

          if (shouldBeValid) {
            expect(mockRes.json).toHaveBeenCalled();
          } else {
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Invalid airport code.') }));
          }
        });
      });
    });

    it('validates date props', async () => {
      [
        'outboundDate',
        'returnDate'
      ].forEach(async (prop) => {
        [
          ['200-01-01', false],
          ['200a-01-01', false],
          ['2000-1-01', false],
          ['2000-01-0', false],
          ['2000-0a-01', false],
          ['2000-01-0a', false],
          ['2000/01-01', false],
          ['2000-01/01', false],
          ['2000-01-01', true],
        ].forEach(async ([ dateString, shouldBeValid ]) => {
          const query = {
            ...defaultQuery,
            [prop]: dateString
          };

          await flightSearchHandlers.getFlightSearchHandler({ query }, mockRes);

          if (shouldBeValid) {
            expect(mockRes.json).toHaveBeenCalled();
          } else {
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Invalid date string.') }));
          }
        });
      });
    });

    it('validates take', async () => {
      [
        [0, false],
        [256, false],
        ['0', false],
        [1, true],
        [255, true],
        [5, true],
      ].forEach(async ([ take, shouldBeValid ]) => {
        const query = {
          ...defaultQuery,
          take
        };

        await flightSearchHandlers.getFlightSearchHandler({ query }, mockRes);

        if (shouldBeValid) {
          expect(mockRes.json).toHaveBeenCalled();
        } else {
          expect(mockRes.status).toHaveBeenCalledWith(500);
          expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Invalid small int.') }));
        }
      });
    });

    it('validates skip', async () => {
      [
        [256, false],
        ['0', false],
        [null, true],
        [undefined, true],
        [0, true],
        [1, true],
        [255, true],
        [5, true],
      ].forEach(async ([ skip, shouldBeValid ]) => {
        const query = {
          ...defaultQuery,
          skip
        };

        await flightSearchHandlers.getFlightSearchHandler({ query }, mockRes);

        if (shouldBeValid) {
          expect(mockRes.json).toHaveBeenCalled();
        } else {
          expect(mockRes.status).toHaveBeenCalledWith(500);
          expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Invalid small int.') }));
        }
      });
    });
  });
});