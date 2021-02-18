import {IPataviProblem} from './IPataviProblem';

export interface IPreferencesSensitivityCommand extends IPataviProblem {
  method: 'sensitivityWeightPlot';
  sensitivityAnalysis: {
    criterion: string;
  };
}
