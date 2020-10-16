import significantDigits from 'app/ts/ManualInput/Util/significantDigits';

export function getStringForInputValue(
  value: number,
  usePercentage: boolean
): string {
  if (usePercentage) {
    return significantDigits(significantDigits(value) * 100).toString();
  } else {
    return significantDigits(value).toString();
  }
}
