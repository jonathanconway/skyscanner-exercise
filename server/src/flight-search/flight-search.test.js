const flightSearch = require('./flight-search');
const livePricing = require('./live-pricing');

// mock shortid
jest.mock('shortid', () => ({
  generate: () => {
    this.shortIdCounter = this.shortIdCounter || 0;
    return this.shortIdCounter++;
  }
}));

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
livePricing.search.mockImplementation(async () => {
  const forN = (n) => Array(n).fill(0).map((_, index) => index);
  const fakeProps = (index, ...propNames) => propNames.reduce((obj, propName) => ({ ...obj, [propName]: `${propName}-${index}` }), {});

  const Agents = forN(5).map((_, agentIndex) => fakeProps(agentIndex, "Id", "Name", "ImageUrl"));

  const Places = forN(12).map((_, placeIndex) => fakeProps(placeIndex, "Id", "Name", "ImageUrl", "Code"));

  const Carriers = forN(6).map((_, carrierIndex) => fakeProps(carrierIndex, "Id", "Code", "Name", "ImageUrl"));

  const dates = [
    "2019-11-04T06:15:00",
    "2019-11-04T11:30:00",
    "2019-11-05T11:05:00",
    "2019-11-04T17:00:00",
    "2019-11-05T14:05:00",
    "2019-11-05T17:50:00",
    "2019-11-05T06:30:00",
    "2019-11-05T07:55:00",
    "2019-11-04T19:40:00",
    "2019-11-04T14:05:00",
    "2019-11-05T19:45:00",
    "2019-11-05T11:05:00",
  ];

  const Segments = forN(6).map((_, segmentIndex) => ({
    ...fakeProps(segmentIndex, "Id"),
    OriginStation: Places[segmentIndex * 2].Id,
    DestinationStation: Places[(segmentIndex * 2) + 1].Id,
    Carrier: Carriers[segmentIndex].Id,
    DepartureDateTime: dates[segmentIndex * 2],
    ArrivalDateTime: dates[(segmentIndex * 2) + 1],
    Duration: segmentIndex * 100
  }));

  const Legs = [
    {
      Id: "Id-0",
      SegmentIds: [Segments[0].Id, Segments[1].Id],
      DepartureDateTime: dates[0],
      ArrivalDateTime: dates[1],
    },
    {
      Id: "Id-1",
      SegmentIds: [Segments[2].Id, Segments[3].Id],
      DepartureDateTime: dates[2],
      ArrivalDateTime: dates[3],
    },
    {
      Id: "Id-2",
      SegmentIds: [Segments[4].Id],
      DepartureDateTime: dates[4],
      ArrivalDateTime: dates[5],
    },
    {
      Id: "Id-3",
      SegmentIds: [Segments[5].Id],
      DepartureDateTime: dates[6],
      ArrivalDateTime: dates[7],
    }
  ];

  const Itineraries = ([
    {
      Id: "Id-0",
      OutboundLegId: Legs[0].Id,
      InboundLegId: Legs[1].Id,
      PricingOptions: [
        {
          Agents: [Agents[0].Id],
          Price: 123,
        }, {
          Agents: [Agents[1].Id],
          Price: 456,
        }
      ]
    },
    {
      Id: "Id-1",
      OutboundLegId: Legs[2].Id,
      InboundLegId: Legs[3].Id,
      PricingOptions: [
        {
          Agents: [Agents[1].Id],
          Price: 456,
        }, {
          Agents: [Agents[2].Id],
          Price: 123,
        }
      ]
    }
  ]);

  const result = {
    Agents,
    Carriers,
    Places,
    Segments,
    Legs,
    Itineraries,
  };

  return result;
});

describe('flightSearch', () => {
  it('calls live pricing api and transforms results into correctly structured flight search results', async () => {
    const query = {
      originPlace: 'EDI',
      destinationPlace: 'LHR',
      outboundDate: '2019-10-16'
    };
    
    const result = await flightSearch(query);

    expect(result).toMatchSnapshot();
  });
});
