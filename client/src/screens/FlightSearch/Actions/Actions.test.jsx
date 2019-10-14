import React from 'react';
import ReactDOM from 'react-dom';
import ShallowRenderer from 'react-test-renderer/shallow';

import Actions from './Actions';

describe('Actions', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<Actions />, div);
  });

  it('should render correctly', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<Actions />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});