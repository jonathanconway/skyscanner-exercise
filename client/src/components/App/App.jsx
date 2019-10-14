import React from 'react';

import Header from './../Header';
import FlightSearch from '../../screens/FlightSearch/FlightSearch';
import { dateTime } from '../../utils';

import STYLES from './App.scss';

const c = className => STYLES[className] || 'UNKNOWN';

const App = () => {
  const outboundDate = dateTime.getNextMonday(new Date()),
        returnDate = dateTime.getNextDay(outboundDate);

  return (
    <div className={c('App')}>
      <Header />
      <main className={c('App__main')}>
        <FlightSearch
          originAirportCode='EDI'
          destinationAirportCode='LHR'
          outboundDate={dateTime.formatDate(outboundDate)}
          returnDate={dateTime.formatDate(returnDate)}
          numberOfTravellers={2}
          currencyCode='GBP'
          flightClass='economy'
        />
      </main>
    </div>
  );
};

export default App;
