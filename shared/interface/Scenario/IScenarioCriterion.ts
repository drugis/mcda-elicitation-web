import IPvf from '../Problem/IPvf';
import IScenarioPvf from './IScenarioPvf';

export default interface IScenarioCriterion {
  dataSources: [{pvf: IScenarioPvf}];
}
