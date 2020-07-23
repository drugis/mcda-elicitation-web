import significantDigits from 'app/ts/ManualInput/Util/significantDigits';

export function getStringForValue(
  value: number,
  usePercentage: boolean
): string {
  if (usePercentage) {
    return significantDigits(significantDigits(value) * 100) + '%';
  } else {
    return significantDigits(value).toString();
  }
}
