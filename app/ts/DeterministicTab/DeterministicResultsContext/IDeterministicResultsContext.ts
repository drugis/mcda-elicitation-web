import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IWeights from '@shared/interface/Scenario/IWeights';
import ISensitivityValue from 'app/ts/interface/ISensitivityValue';

export default interface IDeterministicResultsContext {
  weights: IWeights;
  baseTotalValues: Record<string, number>;
  baseValueProfiles: Record<string, Record<string, number>>;
  recalculatedTotalValues: Record<string, number>;
  recalculatedValueProfiles: Record<string, Record<string, number>>;
  sensitivityTableValues: Record<string, Record<string, ISensitivityValue>>;
  measurementSensitivityCriterion: ICriterion;
  measurementSensitivityAlternative: IAlternative;
  measurementsSensitivityResults: Record<string, Record<number, number>>;
  preferencesSensitivityCriterion: ICriterion;
  preferencesSensitivityResults: Record<string, Record<number, number>>;
  recalculateValuePlots: () => void;
  resetSensitivityTable: () => void;
  setCurrentValue: (
    criterionId: string,
    alternativeId: string,
    newValue: number
  ) => void;
  setMeasurementSensitivityCriterion: (criterion: ICriterion) => void;
  setMeasurementSensitivityAlternative: (criterion: IAlternative) => void;
  setPreferencesSensitivityCriterion: (criterion: ICriterion) => void;
}
