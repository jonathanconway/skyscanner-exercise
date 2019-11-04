const flightSearch = require('./flight-search');  

/**
 * Query object for /api/search endpoint.
 * @typedef {Object} SearchQuery
 * @property {string} originAirportCode - Code of airport to fly out from.
 * @property {string} destinationAirportCode - code of airport to fly in to.
 * @property {string} outboundDate - Date of flight, in the format: 'YYYY-MM-DD'.
 * @property {string} returnDate - Date of return flight, in the format: 'YYYY-MM-DD'.
 * @property {number} skip - Page skip amount. (Optional.)
 * @property {number} take - Page take amount. (Optional.)
 * @property {string} currencyCode - Three letter currency code. E.g.: 'GBP'.
 */

/**
  Handle flight search GET requests.
  @param {...{query: SearchQuery}} req - Request containing SearchQuery.
*/
const getFlightSearchHandler = async (req, res) => {
  try {
    validateApiSearch(req);

    const flightSearchResults = await flightSearch(req.query);

    res.json(flightSearchResults);
  } catch (err) {
    res.status(500).send(err);
    console.error('Error', err);
  }
};

/**
  Validate inputs to /api/search endpoint. Throw if invali.
  @param {...{query: SearchQuery}} req - Request containing SearchQuery.
*/
const validateApiSearch = (req) => {
  const validateAirportCode = code => {
    if (!(code && code.length < 5 && /^[A-Z]*$/gm.test(code))) {
      throw 'Invalid airport code.';
    }
  };

  const validateDateString = dateString => {
    if (!(dateString && /^[0-9]...-[0-9].-[0-9].$/gm.test(dateString))) {
      throw 'Invalid date string.';
    }
  };

  const validateSmallInt = smallInt => {
    const smallIntAsNumber = Number(smallInt);
    if (smallIntAsNumber && smallIntAsNumber < 0 || smallIntAsNumber > 255) {
      throw 'Invalid small int.';
    }
  };

  const validateUndefinedOr = (value, fn) => {
    if (value === undefined) {
      return;
    }
    fn(value);
  };

  validateAirportCode(req.query.originAirportCode);
  validateAirportCode(req.query.destinationAirportCode);
  validateDateString(req.query.outboundDate);
  validateDateString(req.query.returnDate);
  validateUndefinedOr(req.query.skip, validateSmallInt);
  validateSmallInt(req.query.take);
};

module.exports = {
  getFlightSearchHandler
};