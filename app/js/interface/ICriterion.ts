import IDataSource from './IDataSource';

export default interface ICriterion {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  isFavourable: boolean;
  dataSources: IDataSource[];
}
