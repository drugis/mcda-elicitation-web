import {TDisplayMode} from './TDisplayMode';
import {TPercentageOrDecimal} from './TPercentageOrDecimal';
import {TScalesCalculationMethod} from './TScalesCalculationMethod';

export default interface ISettings {
  calculationMethod: TScalesCalculationMethod;
  showPercentages: TPercentageOrDecimal;
  displayMode: TDisplayMode;
  randomSeed: number;
}
