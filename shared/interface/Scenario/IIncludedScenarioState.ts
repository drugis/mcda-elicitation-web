import IExactSwingRatio from './IExactSwingRatio';
import IOrdinalRanking from './IOrdinalRanking';
import IRatioBoundConstraint from './IRatioBoundConstraint';
import IScenarioProblem from './IScenarioProblem';
import IUpperRatioConstraint from './IUpperRatioConstraint';
import IWeights from './IWeights';

export default interface IIncludedScenarioState {
  prefs:
    | IOrdinalRanking[]
    | IExactSwingRatio[]
    | IRatioBoundConstraint[]
    | IUpperRatioConstraint[];
  weights?: IWeights;
  problem?: IScenarioProblem;
}
