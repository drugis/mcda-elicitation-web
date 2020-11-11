import significantDigits from './significantDigits';

describe('significantDigits', () => {
  it('should round the input to have 3 significant digits', function () {
    expect(significantDigits(0)).toBe(0);
    expect(significantDigits(100)).toBe(100);
    expect(significantDigits(0.00001)).toBe(0.00001);
    expect(significantDigits(0.100001)).toBe(0.1);
    expect(significantDigits(51.870000000000005)).toBe(51.87);
    expect(significantDigits(1234.1)).toBe(1234.1);
    expect(significantDigits(12345)).toBe(12345);
    expect(significantDigits(-12345)).toBe(-12345);
    expect(significantDigits(-1.2345)).toBe(-1.234);
  });

  it('should work for other precisions', function () {
    expect(significantDigits(10.2345, 1)).toBe(10.2);
    expect(significantDigits(10.2345, 2)).toBe(10.23);
    expect(significantDigits(10.2345, 5)).toBe(10.2345);
    expect(significantDigits(10.2345123, 5)).toBe(10.23451);
    expect(significantDigits(10.23, 5)).toBe(10.23);
  });
});
