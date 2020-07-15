import IDataSource from './IDataSource';

export default interface IDataSourceCommand extends IDataSource {
  inProgressWorkspaceId: number;
  orderIndex: number;
}
