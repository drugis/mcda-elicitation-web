export type AnalysisType = 'deterministic' | 'smaa';
export type DisplayMode = 'enteredData' | 'values';
export type ScalesCalculationMethod = 'median' | 'mode';

export default interface ISettings {
  calculationMethod: ScalesCalculationMethod;
  showPercentages: boolean;
  displayMode: DisplayMode;
  analysisType: AnalysisType;
  hasNoEffects: boolean;
  hasNoDistributions: boolean;
  isRelativeProblem: boolean;
  changed: boolean;
  randomSeed: number;
}
