import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BpkExtraLargeSpinner, BpkSpinner } from 'bpk-component-spinner';
import BpkBannerAlert, { ALERT_TYPES } from 'bpk-component-banner-alert';
import BpkButton from 'bpk-component-button';

import FlightSearchContext from './FlightSearch.context';
import Header from './Header/Header';
import Actions from './Actions/Actions';
import Itinerary from './Itinerary/Itinerary';
import http from './FlightSearch.http';

import STYLES from './FlightSearch.scss';

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
        [itineraries, setItineraries] = useState(undefined),
        [page, setPage] = useState(0);

  const loadItineraries = async () => {
    setError(undefined);
    setIsLoadingItineraries(true);

    try {
      let results = await http.getSearch({
        originAirportCode,
        destinationAirportCode,
        outboundDate,
        returnDate,
        skip: page * 5,
        take: DEFAULT_TAKE,
        currencyCode
      });

      if (page > 0) {
        setItineraries([ ...itineraries, ...results.itineraries ]);
      } else {
        setItineraries(results.itineraries);
      }
    } catch (ex) {
      setError(ex);
    }

    setIsLoadingItineraries(false);
  };

  const handleClickNext = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (!isLoadingItineraries) {
      loadItineraries();
    }
  }, [page]);

  return (
    <FlightSearchContext.Provider value={props}>
      <div className={c('FlightSearch')}>
        <Header />

        <Actions />

        <div className={c('FlightSearch__itineraries')}>
          {(isLoadingItineraries && page === 0) &&
            <BpkExtraLargeSpinner className={c('FlightSearch__itineraries-spinner')} />}
          
          {error &&
            <BpkBannerAlert
              className={c('FlightSearch__itineraries-error')}
              message={`Sorry! There was an error: '${error}'. Please try refreshing.`}
              type={ALERT_TYPES.ERROR}
            />}

          {itineraries && itineraries.map(itinerary => (
            <Itinerary
              key={itinerary.id}
              {...itinerary}
            />
          ))}

          {(!(isLoadingItineraries && page === 0)) &&
            <BpkButton
              className={c('FlightSearch__itineraries-next-button')}
              onClick={handleClickNext}
            >
              Next {DEFAULT_TAKE} Results
              {(isLoadingItineraries && page > 0) &&
                <BpkSpinner className={c('FlightSearch__itineraries-next-button-spinner')} />}
            </BpkButton>}
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
