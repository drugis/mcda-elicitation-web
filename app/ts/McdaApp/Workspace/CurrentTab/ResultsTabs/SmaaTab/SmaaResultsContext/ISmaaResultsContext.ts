import IWeights from '@shared/interface/IWeights';
import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';

export interface ISmaaResultsContext {
  centralWeights: Record<string, ICentralWeight>;
  problemHasStochasticMeasurements: boolean;
  problemHasStochasticWeights: boolean;
  ranks: Record<string, number[]>;
  smaaWeights: IWeights;
  useMeasurementsUncertainty: boolean;
  useWeightsUncertainty: boolean;
  setUseMeasurementsUncertainty: (useMeasurementsUncertainty: boolean) => void;
  setUseWeightsUncertainty: (useWeightsUncertainty: boolean) => void;
}
