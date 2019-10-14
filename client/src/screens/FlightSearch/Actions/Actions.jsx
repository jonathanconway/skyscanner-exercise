import React from 'react';

import BpkSmallPriceAlerts from 'bpk-component-icon/sm/price-alerts';
import BpkButton from 'bpk-component-button';

import STYLES from './Actions.scss';

const c = className => STYLES[className] || 'UNKNOWN';

const Actions = () => {
  return (
    <div className={c('Actions')}>
      <div>
        <BpkButton link>Filter</BpkButton>
        <BpkButton link>Sort</BpkButton>
      </div>
      <div>
        <BpkButton link>
          <BpkSmallPriceAlerts className={c('Actions__icon')} />Price Alerts
        </BpkButton>
      </div>
    </div>
  );
};

export default Actions;
