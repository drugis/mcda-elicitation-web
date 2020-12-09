import IDataSource from '@shared/interface/IDataSource';

export default interface IOverviewDataSourceContext {
  dataSource: IDataSource;
  nextDataSourceId: string;
  previousDataSourceId: string;
  index: number;
}
