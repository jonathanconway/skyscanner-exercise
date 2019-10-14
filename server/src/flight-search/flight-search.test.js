const flightSearch = require('./flight-search');
const livePricing = require('./live-pricing');
const flightSearchTestData = require('./flight-search.test-data.json');

// mock config
jest.mock('../config', () => ({
  currency: 'GBP',
  currencies: {
    GBP: {
      code: 'GBP',
      symbol: '£'
    }
  },
}));

// mock live-pricing
jest.mock('./live-pricing');
livePricing.search.mockImplementation(async () => ({
  ...flightSearchTestData,
  Itineraries: flightSearchTestData.Itineraries.slice(0, 5)
}));

describe('flightSearch', () => {
  it('calls live pricing api and transforms results into correctly structured flight search results', async () => {
    const result = await flightSearch({
      originPlace: 'EDI',
      destinationPlace: 'LHR',
      outboundDate: '2019-10-16'
    });

    // Itineraries
    expect(result).toBeTruthy();
    expect(result.itineraries).toBeTruthy();
    expect(Array.isArray(result.itineraries)).toBeTruthy();
    expect(result.itineraries.length).toEqual(5);

    // Ids
    expect(result.itineraries.map(it => it.id))
      .toEqual([ 0, 1, 2, 3, 4 ])

    // Prices
    expect(result.itineraries.every(it => it.price.currency.code === 'GBP'))
      .toBeTruthy();
    expect(result.itineraries.every(it => it.price.currency.symbol === '£'))
      .toBeTruthy();

    expect(result.itineraries.map(it => it.price.amount))
      .toEqual([ 345.81, 482.14, 336.5, 517.94, 260.62 ]);

    // Leg - Segments - Departures
    expect(result.itineraries.map(it => it.leg.segments.map(seg => seg.departure)))
      .toEqual(
        [ [ { airportCode: 'EDI', dateTime: '2019-10-16T16:20:00' },
            { airportCode: 'BRU', dateTime: '2019-10-16T21:25:00' } ],
          [ { airportCode: 'EDI', dateTime: '2019-10-16T12:40:00' },
            { airportCode: 'CGN', dateTime: '2019-10-16T18:30:00' } ],
          [ { airportCode: 'EDI', dateTime: '2019-10-16T08:50:00' },
            { airportCode: 'SNN', dateTime: '2019-10-17T07:30:00' } ],
          [ { airportCode: 'EDI', dateTime: '2019-10-16T06:00:00' },
            { airportCode: 'AMS', dateTime: '2019-10-16T11:50:00' },
            { airportCode: 'MXP', dateTime: '2019-10-16T16:55:00' } ],
          [ { airportCode: 'EDI', dateTime: '2019-10-16T08:15:00' } ] ]);

    // Leg - Segments - Arrivals
    expect(result.itineraries.map(it => it.leg.segments.map(seg => seg.arrival)))
      .toEqual(
        [ [ { airportCode: 'BRU', dateTime: '2019-10-16T19:00:00' },
            { airportCode: 'LHR', dateTime: '2019-10-16T21:35:00' } ],
          [ { airportCode: 'CGN', dateTime: '2019-10-16T15:30:00' },
            { airportCode: 'LHR', dateTime: '2019-10-16T19:05:00' } ],
          [ { airportCode: 'SNN', dateTime: '2019-10-16T10:30:00' },
            { airportCode: 'LHR', dateTime: '2019-10-17T09:05:00' } ],
          [ { airportCode: 'AMS', dateTime: '2019-10-16T08:35:00' },
            { airportCode: 'MXP', dateTime: '2019-10-16T13:25:00' },
            { airportCode: 'LHR', dateTime: '2019-10-16T18:00:00' } ],
          [ { airportCode: 'LHR', dateTime: '2019-10-16T09:50:00' } ] ]);

    // Leg - Segments - Carriers
    expect(result.itineraries.map(it => it.leg.segments.map(seg => seg.carrier)))
      .toEqual(
        [ [ { name: 'Brussels Airlines',
              imageUrl: 'https://s1.apideeplink.com/images/airlines/SN.png' },
            { name: 'Brussels Airlines',
              imageUrl: 'https://s1.apideeplink.com/images/airlines/SN.png' } ],
          [ { name: 'eurowings',
              imageUrl: 'https://s1.apideeplink.com/images/airlines/EW.png' },
            { name: 'eurowings',
              imageUrl: 'https://s1.apideeplink.com/images/airlines/EW.png' } ],
          [ { name: 'British Airways',
              imageUrl: 'https://s1.apideeplink.com/images/airlines/BA.png' },
            { name: 'British Airways',
              imageUrl: 'https://s1.apideeplink.com/images/airlines/BA.png' } ],
          [ { name: 'Alitalia',
              imageUrl: 'https://s1.apideeplink.com/images/airlines/AZ.png' },
            { name: 'Alitalia',
              imageUrl: 'https://s1.apideeplink.com/images/airlines/AZ.png' },
            { name: 'Alitalia',
              imageUrl: 'https://s1.apideeplink.com/images/airlines/AZ.png' } ],
          [ { name: 'British Airways',
              imageUrl: 'https://s1.apideeplink.com/images/airlines/BA.png' } ] ]);

    // Leg - Segments - Durations
    expect(result.itineraries.map(it => it.leg.segments.map(seg => seg.duration)))
      .toEqual([ [ 100, 70 ], [ 110, 95 ], [ 100, 95 ], [ 95, 95, 125 ], [ 95 ] ]);
  });
});
