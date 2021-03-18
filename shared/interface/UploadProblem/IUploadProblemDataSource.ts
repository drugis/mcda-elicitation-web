import IProblemDataSource from '../Problem/IProblemDataSource';
import {TPvf} from '../Problem/IPvf';

export default interface IUploadProblemDataSource extends IProblemDataSource {
  pvf: TPvf;
}
