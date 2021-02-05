export interface IMeasurementsSensitivityResults {
  alt: {alternative: string};
  crit: {criterion: string};
  total: Record<string, Record<number, number>>;
}
