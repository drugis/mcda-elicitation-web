import {getPataviTaskUrl} from '../node-backend/patavi';

describe('patavi shim', () => {
  it('re-exports a function', () => {
    expect(typeof getPataviTaskUrl).toBe('function');
  });
});
