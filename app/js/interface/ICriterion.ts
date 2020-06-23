import IDataSource from './IDataSource';

export default interface ICriterion {
  id: string;
  title: string;
  description: string;
  isFavourable: boolean;
  dataSources: IDataSource[];
}
