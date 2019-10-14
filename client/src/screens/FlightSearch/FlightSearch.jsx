import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BpkExtraLargeSpinner } from 'bpk-component-spinner';
import BpkBannerAlert, { ALERT_TYPES } from 'bpk-component-banner-alert';

import FlightSearchContext from './FlightSearch.context';
import Header from './Header/Header';
import Actions from './Actions/Actions';
import Itinerary from './Itinerary/Itinerary';

import STYLES from './FlightSearch.scss';
import http from './FlightSearch.http';

const c = className => STYLES[className] || 'UNKNOWN';

export const DEFAULT_TAKE = 5;

const FlightSearch = (props) => {
  const {
          originAirportCode,
          destinationAirportCode,
          outboundDate,
          returnDate,
          currencyCode
        } = props,

        [isLoadingItineraries, setIsLoadingItineraries] = useState(false),
        [error, setError] = useState(undefined),
        [itineraries, setItineraries] = useState(undefined);

  useEffect(() => {
    const loadItineraries = async () => {
      setError(undefined);
      setIsLoadingItineraries(true);
  
      try {
        const itineraries = await http.getSearch({
            originAirportCode,
            destinationAirportCode,
            outboundDate,
            returnDate,
            take: DEFAULT_TAKE,
            currencyCode
          });

        setItineraries(itineraries);
      } catch (ex) {
        setError(ex);
      }
  
      setIsLoadingItineraries(false);
    };
    
    loadItineraries();
  }, []);

  return (
    <FlightSearchContext.Provider value={props}>
      <div className={c('FlightSearch')}>
        <Header />

        <Actions />

        <div className={c('FlightSearch__itineraries')}>
          {isLoadingItineraries &&
            <BpkExtraLargeSpinner className={c('FlightSearch__itineraries-spinner')} />}
          
          {error &&
            <BpkBannerAlert
              className={c('FlightSearch__itineraries-error')}
              message={`Sorry! There was an error: '${error}'. Please try refreshing.`}
              type={ALERT_TYPES.ERROR}
            />}

          {itineraries && itineraries.itineraries.map(itinerary => (
            <Itinerary
              key={itinerary.id}
              {...itinerary}
            />
          ))}
        </div>
      </div>
    </FlightSearchContext.Provider>
  );
};

FlightSearch.propTypes = {
  originAirportCode: PropTypes.string,
  destinationAirportCode: PropTypes.string,
  outboundDate: PropTypes.string,
  returnDate: PropTypes.string,
  numberOfTravellers: PropTypes.oneOf([1, 2]),
  currencyCode: PropTypes.string,
  flightClass: PropTypes.oneOf(['economy', 'business'])
};

export default FlightSearch;
