import IDistribution from './IDistribution';

export default interface IStudentsTDistribution extends IDistribution {
  type: 'dt';
  mean: number;
  standardError: number;
  dof: number;
}
