import IProblemCriterion from '../Problem/IProblemCriterion';
import IUploadProblemDataSource from './IUploadProblemDataSource';

export default interface IUploadProblemCriterion
  extends Omit<IProblemCriterion, 'dataSoures'> {
  dataSources: IUploadProblemDataSource[];
}
