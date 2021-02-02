import IWeights from '@shared/interface/Scenario/IWeights';
import ISensitivityValue from 'app/ts/interface/ISensitivityValue';

export default interface IDeterministicResultsContext {
  weights: IWeights;
  baseTotalValues: Record<string, number>;
  baseValueProfiles: Record<string, Record<string, number>>;
  recalculatedTotalValues: Record<string, number>;
  recalculatedValueProfiles: Record<string, Record<string, number>>;
  sensitivityTableValues: Record<string, Record<string, ISensitivityValue>>;
  recalculateValuePlots: () => void;
  resetSensitivityTable: () => void;
  setCurrentValue: (
    criterionId: string,
    alternativeId: string,
    newValue: number
  ) => void;
}
