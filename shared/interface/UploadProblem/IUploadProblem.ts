import IProblem from '../Problem/IProblem';
import IUploadProblemCriterion from './IUploadProblemCriterion';

export default interface IUploadProblem extends Omit<IProblem, 'criteria'> {
  criteria: Record<string, IUploadProblemCriterion>;
}
