const livePricing = require('./live-pricing');
const config = require('../config');

/**
 * Search for flights using live pricing API and transform results to an appropriate structure.
 *
 * @param flightSearchQuery Query by which to constrain the search.
 * @return Transformed search results.
 */
const flightSearch = async (flightSearchQuery) => {
  const livePricingQuery = mapLivePricingQuery(flightSearchQuery);
  
  const livePricingData = await livePricing.search(livePricingQuery);

  const currency = getCurrency();
        
  const itineraries = mapItineraries(livePricingData, currency);

  return { itineraries };
};

const mapLivePricingQuery = (query) => {
  console.log('Generating live pricing query..', query);

  const livePricingQuery = {
    originPlace: query.originAirportCode,
    destinationPlace: query.destinationAirportCode,
    outboundDate: query.outboundDate,
    inboundDate: query.returnDate,
    pageSize: query.take,
    currency: query.currencyCode
  }
  console.log('Generated live pricing query..', livePricingQuery);

  return livePricingQuery;
};

const getCurrency = () => {
  console.log('Config', config);
  const currency = config.currencies[config.currency];
  console.log('Currency config..', currency);
  return currency;
};

const mapItineraries = (sourceData, currency) => {
  const mappedItineraries = sourceData.Itineraries.map((sourceItinerary, sourceItineraryIndex) => {
    const leg = mapLeg(sourceData, sourceItinerary.OutboundLegId);

    return {
      id: sourceItineraryIndex,
      leg,
      price: mapPrice(sourceData, sourceItinerary.PricingOptions, currency)
    };
  });

  console.log('Mapped itineraries', mappedItineraries);
  return mappedItineraries;
};

const mapLeg = (sourceData, sourceLegId) => {
  const matchingSourceLeg = sourceData.Legs.find(leg => leg.Id === sourceLegId),
        segments = matchingSourceLeg.SegmentIds.map(segmentId => mapSegment(sourceData, segmentId));

  return {
    segments
  };
};

const mapSegment = (sourceData, sourceSegmentId) => {
  const matchingSourceSegment = sourceData.Segments.find(segment => segment.Id === sourceSegmentId);

  return {
    id: sourceSegmentId,
    departure: {
      airportCode: mapAirportCode(sourceData, matchingSourceSegment.OriginStation),
      dateTime: mapDateTime(matchingSourceSegment.DepartureDateTime)
    },
    arrival: {
      airportCode: mapAirportCode(sourceData, matchingSourceSegment.DestinationStation),
      dateTime: mapDateTime(matchingSourceSegment.ArrivalDateTime)
    },
    duration: matchingSourceSegment.Duration,
    carrier: mapCarrier(sourceData, matchingSourceSegment.Carrier)
  };
};

const mapAirportCode = (sourceData, sourcePlaceId) => {
  const matchingSourcePlace = sourceData.Places.find(place => place.Id === sourcePlaceId);

  return matchingSourcePlace.Code;
};

const mapDateTime = (sourceDateTime) => {
  return sourceDateTime;
};

const mapCarrier = (sourceData, carrierId) => {
  const machingSourceCarrier = sourceData.Carriers.find(carrier => carrier.Id === carrierId);

  return {
    name: machingSourceCarrier.Name,
    imageUrl: machingSourceCarrier.ImageUrl
  };
};

const mapPrice = (sourceData, sourcePricingOptions, currency) => {
  const cheapestPricingOption = cheapestPricingOptionSelector(sourcePricingOptions),
        agent = mapAgent(sourceData, cheapestPricingOption.Agents[0]);

  return {
    amount: cheapestPricingOption.Price,
    currency,
    agent
  };
};

const cheapestPricingOptionSelector = (sourcePricingOptions) => {
  const cheapest =
          sourcePricingOptions.reduce(
            (cheapestPricedOption, option) =>
              option.Price < cheapestPricedOption.Price
                ? option
                : cheapestPricedOption,
            sourcePricingOptions[0]);

  return cheapest;
}

const mapAgent = (sourceData, agentId) => {
  const matchingSourceAgent = sourceData.Agents.find(agent => agent.Id === agentId);

  return {
    name: matchingSourceAgent.Name
  };
};

module.exports = flightSearch;
