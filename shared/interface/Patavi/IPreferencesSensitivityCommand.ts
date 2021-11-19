import {PreferenceSensitivityParameter} from 'app/ts/type/preferenceSensitivityParameter';
import {IPataviProblem} from './IPataviProblem';

export interface IPreferencesSensitivityCommand extends IPataviProblem {
  method: 'sensitivityWeightPlot';
  sensitivityAnalysis: {
    parameter: PreferenceSensitivityParameter;
    criterion: string;
    lowestValue: number;
    highestValue: number;
    equivalentChanges: Record<string, number>;
  };
}
