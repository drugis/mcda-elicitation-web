import IProblemDataSource from './IProblemDataSource';

export default interface IProblemCriterion {
  id: string;
  title: string;
  description: string;
  isFavorable?: boolean;
  dataSources: IProblemDataSource[];
}
