import {IPataviProblem} from './IPataviProblem';
import {IRecalculatedCell} from './IRecalculatedCell';

export interface IRecalculatedDeterministicResultsCommand
  extends IPataviProblem {
  method: 'sensitivityMeasurements';
  schemaVersion: string;
  sensitivityAnalysis: {
    meas: IRecalculatedCell[];
  };
}
