export function calculateRestrictedAreaWidthPercentage(
  sliderRange: [number, number],
  configuredRange: [number, number]
): string {
  const totalMargin = sliderRange[1] - sliderRange[0];
  const restrictedMargin = configuredRange[1] - configuredRange[0];
  return (restrictedMargin / totalMargin) * 100 + '%';
}
