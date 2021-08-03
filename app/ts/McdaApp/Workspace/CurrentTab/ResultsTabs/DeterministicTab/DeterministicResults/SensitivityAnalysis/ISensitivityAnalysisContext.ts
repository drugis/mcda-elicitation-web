import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';

export default interface ISensitivityAnalysisContext {
  measurementSensitivityAlternative: IAlternative;
  measurementSensitivityCriterion: ICriterion;
  measurementsSensitivityResults: Record<string, Record<number, number>>;
  preferencesSensitivityCriterion: ICriterion;
  preferencesSensitivityResults: Record<string, Record<number, number>>;

  setMeasurementSensitivityAlternative: (criterion: IAlternative) => void;
  setMeasurementSensitivityCriterion: (criterion: ICriterion) => void;
  setPreferencesSensitivityCriterion: (criterion: ICriterion) => void;
}
