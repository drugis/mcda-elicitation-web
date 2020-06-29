import IDistribution from './IDistribution';

export default interface INormalDistribution extends IDistribution {
  type: 'normal';
  mean: number;
  standardError: number;
}
