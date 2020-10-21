import significantDigits from '../ManualInput/Util/significantDigits';

export function getPercentifiedValue(
  value: number,
  showPercentages: boolean
): string {
  if (showPercentages) {
    return significantDigits(value * 100).toString();
  } else {
    return significantDigits(value).toString();
  }
}
