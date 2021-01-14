import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';
import IWeights from '@shared/interface/Scenario/IWeights';

export interface ISmaaResultsContext {
  centralWeights: Record<string, ICentralWeight>;
  problemHasStochasticMeasurements: boolean;
  problemHasStochasticWeights: boolean;
  ranks: Record<string, number[]>;
  smaaWeights: IWeights;
  useMeasurementsUncertainty: boolean;
  useWeightsUncertainty: boolean;
  warnings: string[];
  recalculate: () => void;
  setUseMeasurementsUncertainty: (useMeasurementsUncertainty: boolean) => void;
  setUseWeightsUncertainty: (useWeightsUncertainty: boolean) => void;
}
