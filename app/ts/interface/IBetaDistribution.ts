import IDistribution from './IDistribution';

export default interface IBetaDistribution extends IDistribution {
  type: 'beta';
  alpha: number;
  beta: number;
}
