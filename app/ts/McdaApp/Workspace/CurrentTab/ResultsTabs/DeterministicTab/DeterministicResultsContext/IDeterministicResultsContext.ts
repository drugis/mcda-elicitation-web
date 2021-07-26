import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IWeights from '@shared/interface/Scenario/IWeights';
import {TValueProfile} from '@shared/types/TValueProfile';
import ISensitivityValue from 'app/ts/interface/ISensitivityValue';
import {TProfileCase} from 'app/ts/type/ProfileCase';

export default interface IDeterministicResultsContext {
  areRecalculatedPlotsLoading: boolean;
  baseTotalValues: Record<string, number>;
  baseValueProfiles: Record<string, Record<string, number>>;
  getReference: (profileCase: TProfileCase) => IAlternative;
  getComparator: (profileCase: TProfileCase) => IAlternative;
  measurementSensitivityAlternative: IAlternative;
  measurementSensitivityCriterion: ICriterion;
  measurementsSensitivityResults: Record<string, Record<number, number>>;
  preferencesSensitivityCriterion: ICriterion;
  preferencesSensitivityResults: Record<string, Record<number, number>>;
  recalculatedValueProfiles: Record<string, Record<string, number>>;
  recalculatedTotalValues: Record<string, number>;
  sensitivityTableValues: Record<string, Record<string, ISensitivityValue>>;
  valueProfileType: TValueProfile;
  weights: IWeights;
  recalculateValuePlots: () => void;
  resetSensitivityTable: () => void;
  setCurrentValue: (
    criterionId: string,
    alternativeId: string,
    newValue: number
  ) => void;
  setReference: (profileCase: TProfileCase, alternative: IAlternative) => void;
  setComparator: (profileCase: TProfileCase, alternative: IAlternative) => void;
  setMeasurementSensitivityAlternative: (criterion: IAlternative) => void;
  setMeasurementSensitivityCriterion: (criterion: ICriterion) => void;
  setPreferencesSensitivityCriterion: (criterion: ICriterion) => void;
  setValueProfileType: (valueProfileType: TValueProfile) => void;
}
