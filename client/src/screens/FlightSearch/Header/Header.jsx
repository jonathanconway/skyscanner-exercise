import React, { useContext } from 'react';
import BpkText from 'bpk-component-text';
import BpkSmallLongArrowRight from 'bpk-component-icon/sm/long-arrow-right';

import FlightSearchContext from '../FlightSearch.context';

import STYLES from './Header.scss';

const c = className => STYLES[className] || 'UNKNOWN';

const Header = () => {
  const {
    originAirportCode,
    destinationAirportCode,
    numberOfTravellers,
    flightClass
  } = useContext(FlightSearchContext);

  return (
    <div className={c('Header')}>
      <BpkText tagName="h1" textStyle="xxl" className={c('Header__title')}>
        <span>{originAirportCode}</span>
        <BpkSmallLongArrowRight className={c('Header__title-arrow')} />
        <span>{destinationAirportCode}</span>
      </BpkText>
      <BpkText tagName="p" textStyle="base" className={c('Header__subtitle')}>
        {numberOfTravellers} travellers, {flightClass}
      </BpkText>
    </div>
  );
}

export default Header;