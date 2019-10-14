// mock express
const express = require('express');
jest.mock('express');
const expressMock = {
  get: jest.fn(),
  use: jest.fn(),
  listen: jest.fn(),    
};
express.mockImplementation(() => expressMock);

// mock flight-search-handlers
const flightSearchHandlers = require('./flight-search/flight-search.handlers');
jest.mock('./flight-search/flight-search.handlers');

require('./server.js');

describe('server', () => {
  describe('app', () => {
    it('assigns handlers to routes', () => {
      expect(expressMock.get).toHaveBeenNthCalledWith(1, '/', expect.any(Function));
      expect(expressMock.get).toHaveBeenNthCalledWith(2, '/api/search', flightSearchHandlers.getFlightSearchHandler);
    });
  });
});
