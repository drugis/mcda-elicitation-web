import {getPercentifiedValueLabel} from './DisplayUtil';

describe('getPercentifiedValue', () => {
  it('should return a percentified value if it should show percentages', () => {
    const value = 0.010001;
    const result = getPercentifiedValueLabel(value, true);
    expect(result).toEqual('1');
  });

  it('should return a string of the original value if it should not show percentages', () => {
    const value = 1;
    const result = getPercentifiedValueLabel(value, false);
    expect(result).toEqual('1');
  });
});
