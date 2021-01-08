export interface ISmaaResultsContext {
  isMeasurementUncertaintyDisabled: boolean;
  isWeightsUncertaintyDisabled: boolean;
  useMeasurementsUncertainty: boolean;
  useWeightsUncertainty: boolean;
  warnings: string[];
  setUseMeasurementsUncertainty: (useMeasurementsUncertainty: boolean) => void;
  setUseWeightsUncertainty: (useWeightsUncertainty: boolean) => void;
}
