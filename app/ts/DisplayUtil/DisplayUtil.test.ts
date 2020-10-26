import {getPercentifiedValue} from './DisplayUtil';

describe('getPercentifiedValue', () => {
  it('should return a percentified value if it should show percentages', () => {
    const value = 0.010001;
    const result = getPercentifiedValue(value, true);
    expect(result).toEqual('1');
  });

  it('should return a string of the original value if it should not show percentages', () => {
    const value = 1;
    const result = getPercentifiedValue(value, false);
    expect(result).toEqual('1');
  });
});
