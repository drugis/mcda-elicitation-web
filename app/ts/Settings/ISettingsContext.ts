import {
  AnalysisType,
  DisplayMode,
  ScalesCalculationMethod
} from '@shared/interface/ISettings';

export default interface ISettingsContext {
  scalesCalculationMethod: ScalesCalculationMethod;
  showPercentages: boolean;
  displayMode: DisplayMode;
  analysisType: AnalysisType;
  hasNoEffects: boolean;
  hasNoDistributions: boolean;
  isRelativeProblem: boolean;
  changed: boolean;
  randomSeed: number;
  showDescriptions: boolean;
  showUnitsOfMeasurement: boolean;
  showReferences: boolean;
  showStrengthsAndUncertainties: boolean;
  numberOfToggledColumns: number;
}
