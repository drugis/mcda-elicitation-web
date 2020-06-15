import ICriterion from './ICriterion';
import IDataSource from './IDataSource';

export default interface IDataSourceRowContext {
  criterion: ICriterion;
  dataSourceId: string;
  previousCriterion: ICriterion | undefined;
  nextCriterion: ICriterion | undefined;
  previousDataSource: IDataSource | undefined;
  nextDataSource: IDataSource | undefined;
}
