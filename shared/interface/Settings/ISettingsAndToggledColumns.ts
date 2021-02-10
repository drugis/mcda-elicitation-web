import IToggledColumns from './IToggledColumns';
import {TAnalysisType} from './TAnalysisType';
import {TDisplayMode} from './TDisplayMode';
import {TPercentageOrDecimal} from './TPercentageOrDecimal';
import {TScalesCalculationMethod} from './TScalesCalculationMethod';

export default interface ISettingsAndToggledColumns extends IToggledColumns {
  calculationMethod: TScalesCalculationMethod;
  showPercentages: TPercentageOrDecimal;
  displayMode: TDisplayMode;
  analysisType: TAnalysisType;
  randomSeed: number;
}
