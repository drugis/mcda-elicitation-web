import IDistribution from './IDistribution';

export default interface IGammaDistribution extends IDistribution {
  type: 'beta';
  alpha: number;
  beta: number;
}
