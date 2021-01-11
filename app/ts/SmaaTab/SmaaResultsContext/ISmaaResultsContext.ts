import {ISmaaResults} from '../../../../shared/interface/Patavi/ISmaaResults';

export interface ISmaaResultsContext {
  problemHasStochasticMeasurements: boolean;
  problemHasStochasticWeights: boolean;
  results: ISmaaResults;
  useMeasurementsUncertainty: boolean;
  useWeightsUncertainty: boolean;
  warnings: string[];
  recalculate: () => void;
  setUseMeasurementsUncertainty: (useMeasurementsUncertainty: boolean) => void;
  setUseWeightsUncertainty: (useWeightsUncertainty: boolean) => void;
}
