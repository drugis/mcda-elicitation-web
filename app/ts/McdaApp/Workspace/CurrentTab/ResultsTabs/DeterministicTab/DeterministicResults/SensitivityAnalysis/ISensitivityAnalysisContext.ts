import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {PreferenceSensitivityParameter} from 'app/ts/type/preferenceSensitivityParameter';

export default interface ISensitivityAnalysisContext {
  measurementSensitivityAlternative: IAlternative;
  measurementSensitivityCriterion: ICriterion;
  measurementsSensitivityResults: Record<string, Record<number, number>>;
  preferencesSensitivityCriterion: ICriterion;
  preferencesSensitivityParameter: PreferenceSensitivityParameter;
  preferencesSensitivityResults: Record<string, Record<number, number>>;
  preferencesSensitivityHighestValue: number;
  preferencesSensitivityLowestValue: number;

  setMeasurementSensitivityAlternative: (criterion: IAlternative) => void;
  setMeasurementSensitivityCriterion: (criterion: ICriterion) => void;
  setPreferencesSensitivityCriterion: (criterion: ICriterion) => void;
  setPreferencesSensitivityHighestValue: (value: number) => void;
  setPreferencesSensitivityLowestValue: (value: number) => void;
  setPreferencesSensitivityParameter: (
    parameter: PreferenceSensitivityParameter
  ) => void;
}
