import ICriterion from './ICriterion';
import IDataSource from './IDataSource';

export default interface IDataSourceRowContext {
  criterion: ICriterion;
  dataSource: IDataSource;
  previousCriterionId: string | undefined;
  nextCriterionId: string | undefined;
  previousDataSourceId: string | undefined;
  nextDataSourceId: string | undefined;
}
