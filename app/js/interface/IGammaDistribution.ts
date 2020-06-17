import IDistribution from './IDistribution';

export default interface IGammaDistribution extends IDistribution {
  type: 'gamma';
  alpha: number;
  beta: number;
}
