import React from 'react';
import ReactDOM from 'react-dom';
import ShallowRenderer from 'react-test-renderer/shallow';

import { dateTime } from "../../utils";

import App from './App';

jest.spyOn(dateTime, "getNextMonday").mockImplementation(() => new Date(2019, 9, 28));
jest.spyOn(dateTime, "getNextDay").mockImplementation(() => new Date(2019, 9, 29));

describe('App', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<App />, div);
  });

  it('should render correctly', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<App />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

