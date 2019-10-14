import React from 'react';
import ReactDOM from 'react-dom';
import ShallowRenderer from 'react-test-renderer/shallow';

import Header from './Header';

describe('Header', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<Header />, div);
  });

  it('should render correctly', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<Header />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});