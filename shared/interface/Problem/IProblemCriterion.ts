import IProblemDataSource from './IProblemDataSource';

export default interface IProblemCriterion {
  title: string;
  description: string;
  isFavorable: boolean;
  dataSources: IProblemDataSource[];
}
