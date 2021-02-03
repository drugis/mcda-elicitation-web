import {IPataviProblem} from './IPataviProblem';

export interface IMeasurementsSensitivityCommand extends IPataviProblem {
  method: 'sensitivityMeasurementsPlot';
  schemaVersion: string;
  sensitivityAnalysis: {
    alternative: string;
    criterion: string;
  };
}
