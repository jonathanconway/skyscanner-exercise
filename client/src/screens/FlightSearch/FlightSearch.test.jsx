import React from 'react';
import ReactDOM from 'react-dom';
import { act } from "react-dom/test-utils";
import ShallowRenderer from 'react-test-renderer/shallow';

import http from "./FlightSearch.http";
import FlightSearch, { DEFAULT_TAKE } from './FlightSearch';

describe('FlightSearch', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');

    act(() => {
      ReactDOM.render(<FlightSearch />, div);
    });
  });

  it('should render correctly', () => {
    const renderer = new ShallowRenderer();

    act(() => {
      renderer.render(<FlightSearch />);
    });

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  describe('on mount behavior', () => {
    const div = document.createElement('div');
  
    jest.spyOn(http, 'getSearch')
      .mockImplementationOnce(async () => { })
      .mockImplementationOnce(async () => { })
      .mockImplementationOnce(async () => { throw Error('MESSAGE'); });

    const flightSearchNode =
      <FlightSearch
        originAirportCode='EDI'
        destinationAirportCode='LHR'
        outboundDate='2019-01-01'
        numberOfTravellers={2}
        currencyCode='GBP'
        flightClass="economy"
      />;

    act(() => {
      ReactDOM.render(flightSearchNode, div);

      it('should perform a flight search on mount', (done) => {
        setTimeout(() => {
          expect(http.getSearch).toHaveBeenCalledWith({
            originAirportCode: 'EDI',
            destinationAirportCode: 'LHR',
            outboundDate: '2019-01-01',
            take: DEFAULT_TAKE,
            currencyCode: 'GBP'
          });
          done();
        });
      });
    });
  
    it('should show spinner during loading and then hide it after loading', (done) => {
      const isSpinnerVisible = () => div.getElementsByClassName('FlightSearch__itineraries-spinner').length > 0;

      expect(isSpinnerVisible()).toBeFalsy();
  
      setTimeout(() => {
        expect(isSpinnerVisible()).toBeFalsy();
        done();
      });
    });
  
    it('should show an error if flight search fails', (done) => {
      const isErrorMessageVisible = () => div.getElementsByClassName('FlightSearch__itineraries-error').length > 0;

      expect(isErrorMessageVisible()).toBeFalsy();
  
      setTimeout(() => {
        expect(isErrorMessageVisible()).toBeTruthy();
        done();
      });
    });
  });
});

// describe('FlightSearch.http', () => {
//   it('should call fetch with appropriate querystring parameters', async () => {
//     const mockJson = jest.fn(async () => ({}));
//     const fetchSpy = jest.spyOn(global, 'fetch');
//     fetchSpy.mockImplementation(() => Promise.resolve({ ok: true, json: mockJson })); 

//     await http.getSearch({
//       originAirportCode: 'EDI',
//       destinationAirportCode: 'LHR',
//       outboundDate: '2019-01-01',
//       currencyCode: 'GBP',
//       take: 5
//     });

//     expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('originAirportCode=EDI'));
//     expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('destinationAirportCode=LHR'));
//     expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('outboundDate=2019-01-01'));
//     expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('currencyCode=GBP'));
//     expect(mockJson).toHaveBeenCalled();
//   });

//   it('should throw an error if status if not ok', async () => {
//     const fetchSpy = jest.spyOn(global, 'fetch');
//     fetchSpy.mockImplementation(() => Promise.resolve({ ok: false })); 

//     let exception = false;
//     try {
//       await http.getSearch({});
//     } catch (ex) {
//       exception = true;
//     }
//     expect(exception).toBeTruthy();
//   });
// });
