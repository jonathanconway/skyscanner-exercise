import React from 'react';
import PropTypes from 'prop-types';
import BpkText from 'bpk-component-text';
import BpkSmallLongArrowRight from 'bpk-component-icon/sm/long-arrow-right';
import BpkCard from 'bpk-component-card';
import BpkButton from 'bpk-component-button';
import BpkImage from 'bpk-component-image';

import { carrierFavIconHostAndPath } from '../../../config';
import { dateTime, misc } from '../../../utils';

import STYLES from './Itinerary.scss';

const c = className => STYLES[className] || 'UNKNOWN';

/**
 * Transforms an URL that points to a full-sized carrier image into
 * an URL that points to an icon-sized carrier image.
 * @param {string} imageUrl - Full-sized image URL
 * @return {string} - Icon-sized image URL
 */
const mapCarrierImageUrlToIconUrl = (imageUrl) => {
  return misc.replacePath(imageUrl, carrierFavIconHostAndPath);
};

const Itinerary = ({ id, legs, price }) => {
  return (
    <BpkCard key={id} className={c('Itinerary')}>
      {legs.map((leg, legIndex) => (
        <div key={`leg-${legIndex}`}>
          {leg.segments.map(({
            id,
            carrier,
            departure,
            arrival,
            duration
          }) => (
            <div key={id} className={c('Itinerary__segment')}>
              <BpkImage
                className={c('Itinerary__segment-carrier-icon')}
                altText={carrier.name}
                width={32}
                height={32}
                src={mapCarrierImageUrlToIconUrl(carrier.imageUrl)}
              />

              <div className={c('Itinerary__segment-sides')}>
                <div className={c('Itinerary__segment-sides-side')}>
                  <BpkText tag="span">
                    {dateTime.formatTime(departure.dateTime)}
                  </BpkText>
                  <BpkText tag="span" className={c('Itinerary__segment-sides-side-code')}>
                    {departure.airportCode}
                  </BpkText>
                </div>

                <b className={c('Itinerary__segment-sides-divider')}>
                  <BpkSmallLongArrowRight />
                </b>

                <div className={c('Itinerary__segment-sides-side')}>
                  <BpkText tag="span">
                    {dateTime.formatTime(arrival.dateTime)}
                  </BpkText>
                  <BpkText tag="span" className={c('Itinerary__segment-sides-side-code')}>
                    {arrival.airportCode}
                  </BpkText>
                </div>
              </div>

              <div className={c('Itinerary__segment-details')}>
                <BpkText tag="span">
                  {dateTime.formatDuration(duration)}
                </BpkText>
                <BpkText tag="span" className={c('Itinerary__segment-details-type-direct')}>
                  Direct
                </BpkText>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className={c('Itinerary__details')}>
        <div>
          <BpkText tag="span" textStyle="xl">
            {price.currency.symbol}{price.amount}
          </BpkText>
          <BpkText tag="span" textStyle="base" className={c('Itinerary__details-source')}>
            {price.agent.name}
          </BpkText>
        </div>
        <div>
          <BpkButton large={true} className={c('Itinerary__details-select-button')}>
            Select
          </BpkButton>
        </div>
      </div>
    </BpkCard>
  );
};

Itinerary.propTypes = {
  id: PropTypes.string,
  leg: PropTypes.shape({
    segments: PropTypes.arrayOf(PropTypes.shape({
      carrier: PropTypes.shape({
        name: PropTypes.string,
        imageUrl: PropTypes.string
      }),
      departure: PropTypes.shape({
        dateTime: PropTypes.string,
        airportCode: PropTypes.string,
      }),
      arrival: PropTypes.shape({
        dateTime: PropTypes.string,
        airportCode: PropTypes.string,
      }),
      duration: PropTypes.number
    })),
    price: PropTypes.shape({
      currencySymbol: PropTypes.string,
      amount: PropTypes.number,
      agent: PropTypes.shape({
        name: PropTypes.string
      })
    })
  })
};

export default Itinerary;
