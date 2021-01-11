import {ISmaaResults} from '../../../../shared/interface/Patavi/ISmaaResults';

export interface ISmaaResultsContext {
  isMeasurementUncertaintyDisabled: boolean;
  isWeightsUncertaintyDisabled: boolean;
  results: ISmaaResults;
  useMeasurementsUncertainty: boolean;
  useWeightsUncertainty: boolean;
  warnings: string[];
  calculateResults: () => void;
  setUseMeasurementsUncertainty: (useMeasurementsUncertainty: boolean) => void;
  setUseWeightsUncertainty: (useWeightsUncertainty: boolean) => void;
}
