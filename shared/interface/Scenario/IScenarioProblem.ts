import IScenarioCriterion from './IScenarioCriterion';

export default interface IScenarioProblem {
  criteria: Record<string, IScenarioCriterion>;
}
