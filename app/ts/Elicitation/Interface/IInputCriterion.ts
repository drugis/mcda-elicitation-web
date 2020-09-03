import IInputDataSource from './IInputDataSource';

export default interface IInputCriterion {
  id: string;
  isFavourable: boolean;
  title: string;
  worst: number;
  best: number;
  description: string;
  dataSources: IInputDataSource[];
}
