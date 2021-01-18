import IProblemDataSource from '../Problem/IProblemDataSource';
import IPvf from '../Problem/IPvf';

export default interface IUploadProblemDataSource extends IProblemDataSource {
  pvf: IPvf;
}
