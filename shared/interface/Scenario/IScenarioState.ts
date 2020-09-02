import IExactSwingRatio from './IExactSwingRatio';
import IOrdinalRanking from './IOrdinalRanking';
import IRatioBoundConstraint from './IRatioBoundConstraint';
import IScenarioProblem from './IScenarioProblem';
import IUpperRatioConstraint from './IUpperRatioConstraint';
import IWeights from './IWeights';

export default interface IScenarioState {
  problem: IScenarioProblem;
  prefs:
    | IOrdinalRanking[]
    | IExactSwingRatio[]
    | IRatioBoundConstraint[]
    | IUpperRatioConstraint[];
  legend?: Record<string, string>;
  uncertaintyOptions?: Record<string, boolean>;
  weights?: IWeights;
}
