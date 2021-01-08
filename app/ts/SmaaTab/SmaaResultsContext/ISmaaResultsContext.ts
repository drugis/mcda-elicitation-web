export interface ISmaaResultsContext {
  useMeasurementsUncertainty: boolean;
  useWeightsUncertainty: boolean;
  warnings: string[];
  setUseMeasurementsUncertainty: (useMeasurementsUncertainty: boolean) => void;
  setUseWeightsUncertainty: (useWeightsUncertainty: boolean) => void;
}
