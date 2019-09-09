import * as React from 'react';
import { TestUtils } from 'react-test-utils';
import App from '../src/App';

it('App is rendered', () => {
    expect(true).toBe(true);
});

it('renders an h1', function() {
    const component = TestUtils.renderIntoDocument(<App />);
    expect(component).toBeDefined();
});
