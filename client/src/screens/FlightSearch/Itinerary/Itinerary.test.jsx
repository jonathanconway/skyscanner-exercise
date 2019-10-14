import React from 'react';
import ReactDOM from 'react-dom';
import ShallowRenderer from 'react-test-renderer/shallow';

import Itinerary from './Itinerary';

describe('Itinerary', () => {
  const props = {
    id: 0,
    leg: {
      segments: [
        {
          id: 's0',
          carrier: {
            name: 'CARRIER_NAME',
            imageUrl: 'imageUrl.png'
          },
          departure: {
            dateTime: '2019-10-22T16:20:00',
            airportCode: 'EDI'
          },
          arrival: {
            dateTime: '2019-10-23T16:20:00',
            airportCode: 'LGW'
          },
          duration: 90
        },
        {
          id: 's1',
          carrier: {
            name: 'CARRIER_NAME',
            imageUrl: 'imageUrl.png'
          },
          departure: {
            dateTime: '2019-10-24T16:20:00',
            airportCode: 'LGW'
          },
          arrival: {
            dateTime: '2019-10-25T16:20:00',
            airportCode: 'EDI'
          },
          duration: 120
        }
      ]
    },
    price: {
      currency: {
        code: 'GBP',
        symbol: '£'
      },
      amount: 123,
      agent: {
        name: 'ABC'
      }
    }
  };

  it('should render without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(
      <Itinerary
        {...props}
      />, div);
  });

  it('should render correctly', () => {
    const renderer = new ShallowRenderer();
    renderer.render(
      <Itinerary
        {...props}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
