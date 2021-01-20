import IProblemCriterion from './IScenarioCriterion';

export default interface IScenarioProblem {
  criteria: Record<string, IProblemCriterion>;
}
