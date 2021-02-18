import {IPataviProblem} from './IPataviProblem';

export interface IMeasurementsSensitivityCommand extends IPataviProblem {
  method: 'sensitivityMeasurementsPlot';
  sensitivityAnalysis: {
    alternative: string;
    criterion: string;
  };
}
