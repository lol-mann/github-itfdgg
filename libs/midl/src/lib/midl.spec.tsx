import { render } from '@testing-library/react';

import Midl from './midl';

describe('Midl', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Midl />);
    expect(baseElement).toBeTruthy();
  });
});
