import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';

export default interface IOverviewCriterion {
  criterion: ICriterion;
  nextCriterionId: string;
  previousCriterionId: string;
  dataSources: IDataSource[];
}
