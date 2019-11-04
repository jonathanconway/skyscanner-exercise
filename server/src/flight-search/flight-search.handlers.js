const Joi = require('@hapi/joi');

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
  Validate inputs to /api/search endpoint. Throw if invalid.
  @param {...{query: SearchQuery}} req - Request containing SearchQuery.
*/
const validateApiSearch = (req) => {
  const validateAirportCode = value => {
    Joi.assert(value, Joi.string().max(5).pattern(/^[A-Z]*$/), 'Invalid airport code.');
  };

  const validateFlightDateString = value => {
    Joi.assert(value, Joi.string().pattern(/^[0-9]...-[0-9].-[0-9].$/), 'Invalid date string.');
  };

  const validateTake = value => {
    Joi.assert(value, Joi.number().max(255), 'Invalid small int.');
  };

  const validateSkip = (value) => {
    Joi.assert(value, Joi.number().max(255).optional(), 'Invalid small int.');
  };

  validateAirportCode(req.query.originAirportCode);
  validateAirportCode(req.query.destinationAirportCode);
  validateFlightDateString(req.query.outboundDate);
  validateFlightDateString(req.query.returnDate);
  validateSkip(req.query.skip);
  validateTake(req.query.take);
};

module.exports = {
  getFlightSearchHandler
};