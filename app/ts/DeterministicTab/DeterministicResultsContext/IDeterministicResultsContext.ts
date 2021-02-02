import IWeights from '@shared/interface/Scenario/IWeights';
import ISensitivityValue from 'app/ts/interface/ISensitivityValue';

export default interface IDeterministicResultsContext {
  deterministicWeights: IWeights;
  sensitivityTableValues: Record<string, Record<string, ISensitivityValue>>;
  totalValues: Record<string, number>;
  valueProfiles: Record<string, Record<string, number>>;
  recalculateValuePlots: () => void;
  resetSensitivityTable: () => void;
  setCurrentValue: (
    criterionId: string,
    alternativeId: string,
    newValue: number
  ) => void;
}
