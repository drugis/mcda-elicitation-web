import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IWeights from '@shared/interface/Scenario/IWeights';
import {TValueProfile} from '@shared/types/TValueProfile';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import {TProfileCase} from 'app/ts/type/ProfileCase';

export default interface IDeterministicResultsContext {
  areRecalculatedPlotsLoading: boolean;
  baseTotalValues: Record<string, number>;
  baseValueProfiles: Record<string, Record<string, number>>;
  importances: Record<string, IChangeableValue>;
  measurementSensitivityAlternative: IAlternative;
  measurementSensitivityCriterion: ICriterion;
  measurementsSensitivityResults: Record<string, Record<number, number>>;
  preferencesSensitivityCriterion: ICriterion;
  preferencesSensitivityResults: Record<string, Record<number, number>>;
  recalculatedValueProfiles: Record<string, Record<string, number>>;
  recalculatedTotalValues: Record<string, number>;
  sensitivityTableValues: Record<string, Record<string, IChangeableValue>>;
  valueProfileType: TValueProfile;
  weights: IWeights;
  getComparator: (profileCase: TProfileCase) => IAlternative;
  getReference: (profileCase: TProfileCase) => IAlternative;
  recalculateValuePlots: () => void;
  resetSensitivityTable: () => void;
  setCurrentValue: (
    criterionId: string,
    alternativeId: string,
    newValue: number
  ) => void;
  setComparator: (profileCase: TProfileCase, alternative: IAlternative) => void;
  setReference: (profileCase: TProfileCase, alternative: IAlternative) => void;
  setImportance: (criterionId: string, newValue: number) => void;
  setMeasurementSensitivityAlternative: (criterion: IAlternative) => void;
  setMeasurementSensitivityCriterion: (criterion: ICriterion) => void;
  setPreferencesSensitivityCriterion: (criterion: ICriterion) => void;
  setValueProfileType: (valueProfileType: TValueProfile) => void;
}
