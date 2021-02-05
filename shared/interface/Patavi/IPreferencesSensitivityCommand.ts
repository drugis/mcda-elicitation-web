import {IPataviProblem} from './IPataviProblem';

export interface IPreferencesSensitivityCommand extends IPataviProblem {
  method: 'sensitivityWeightPlot';
  schemaVersion: string;
  sensitivityAnalysis: {
    criterion: string;
  };
}
